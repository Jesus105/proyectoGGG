const { Router } = require('express');
const router = Router();

const admin = require("firebase-admin");
const { route } = require('../app');

const serviceAccount = require("../key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://pdp-ggg-default-rtdb.firebaseio.com"
});

const db = admin.database();

/* Obtener datos */

const get_cars = ()=>{
    let data = db.ref('cars').once('value', (snapshot)=>{
        const data = snapshot.val();
        return data;
    
    });

    const d = {
        brand: data.brand,
        model: data.model,
        year: data.year,
        color: data.color,
        quantity: data.quantity,
        type: data.type
    }

    return d

}

/* Ruta principal */


router.get('/', (req, res) =>{
    db.ref('cars').once('value', (snapshot)=>{
        const data = snapshot.val();
        res.render('index', {cars: data})
    });
    
})

/*Administra ventas*/


router.get('/sells', (req, res) =>{
        res.render('sells/sells')
    
})

/*    Administrar automoviles      */

router.get('/cars', (req, res) =>{
    db.ref('cars').once('value', (snapshot)=>{
        const data = snapshot.val();
        res.render('cars/cars', {cars: data})
    });

    console.log(get_cars()) 
})

router.post('/new-car', (req,res)=>{
    console.log(req.body);
    const newCar = {
        brand: req.body.brand,
        model: req.body.model,
        year: req.body.year,
        color: req.body.color,
        quantity: req.body.quantity,
        type: req.body.type
    }
    db.ref('cars').push(newCar);
    res.redirect("/cars");
})


router.get('/get-car/:id',(req,res)=>{

        db.ref('cars/'+req.params.id).once('value', (snapshot)=>{
            const data = snapshot.val();
            data.id = req.params.id;
            res.render('cars/update-cars', {data})
        })
        
})

router.post('/update-car/:id', (req,res)=>{

    db.ref('cars/'+req.params.id).once('value', (snapshot)=>{
        const data = snapshot.val();
        console.log(data);
        console.log(req.body);
        const updateCar = {
            brand: (req.body.brand!=''? req.body.brand : data.brand),
            model: (req.body.model!=''? req.body.model : data.model),
            year: (req.body.year!=''? req.body.year : data.year),
            color: (req.body.color!=''? req.body.color : data.color),
            quantity: (req.body.quantity!=''? req.body.quantity : data.quantity),
            type: (req.body.type!=''? req.body.type : data.type)
        }
        db.ref('cars/'+req.params.id).set(updateCar);
    })

    res.redirect('/cars');

})

router.get('/delete-car/:id',(req, res)=>{
    db.ref('cars/'+req.params.id).remove();
    res.redirect("/cars");
})

/*Administra clientes*/

router.get('/users', (req, res) =>{
    db.ref('users').once('value', (snapshot)=>{
        const data = snapshot.val();
        res.render('users/users', {users: data})
    });
    
})

router.post('/new-user', (req,res)=>{
    console.log(req.body);
    const newUser = {
        name: req.body.name,
        age: req.body.age,
        email: req.body.email,
        phone: req.body.phone,
        state: req.body.state,
        street: req.body.street,
        s_number: req.body.s_number
    }
    db.ref('users').push(newUser);
    res.redirect("/users");
})

router.get('/get-user/:id',(req,res)=>{

        db.ref('users/'+req.params.id).once('value', (snapshot)=>{
            const data = snapshot.val();
            data.id = req.params.id;
            res.render('users/update-users', {data})
        })
        
})


router.post('/update-user/:id', (req,res)=>{

    db.ref('users/'+req.params.id).once('value', (snapshot)=>{
        const data = snapshot.val();
        console.log(data);
        console.log(req.body);
        const updateUser = {
            name: (req.body.name!=''? req.body.name : data.name),
            age: (req.body.age!=''? req.body.age : data.age),
            email: (req.body.email!=''? req.body.email : data.email),
            phone: (req.body.phone!=''? req.body.phone : data.phone),
            state: (req.body.state!=''? req.body.state : data.state),
            street: (req.body.street!=''? req.body.street : data.street),
            s_number: (req.body.s_number!=''? req.body.s_number : data.s_number)
        }
        db.ref('users/'+req.params.id).set(updateUser);
    })

    res.redirect('/users');

})

router.get('/delete-user/:id',(req, res)=>{
    db.ref('users/'+req.params.id).remove();
    res.redirect("/users");
})

/*Administra sucursales*/


router.get('/stores', (req, res) =>{
    db.ref('stores').once('value', (snapshot)=>{
        const data = snapshot.val();
        res.render('stores/stores', {stores: data})
    });
    
})

router.post('/new-store', (req,res)=>{
    console.log(req.body);
    const newUser = {
        name: req.body.name,
        cp: req.body.cp,
        neighborhood: req.body.neighborhood,
        phone: req.body.phone,
        province: req.body.province,
        street: req.body.street,
    }
    db.ref('stores').push(newUser);
    res.redirect("/stores");
})

router.get('/get-store/:id',(req,res)=>{

        db.ref('stores/'+req.params.id).once('value', (snapshot)=>{
            const data = snapshot.val();
            data.id = req.params.id;
            res.render('stores/update-store', {data})
        })
        
})


router.post('/update-store/:id', (req,res)=>{

    db.ref('stores/'+req.params.id).once('value', (snapshot)=>{
        const data = snapshot.val();
        console.log(data);
        console.log(req.body);
        const updateUser = {
            name: (req.body.name!=''? req.body.name : data.name),
            cp: (req.body.cp!=''? req.body.cp : data.cp),
            phone: (req.body.phone!=''? req.body.phone : data.phone),
            province: (req.body.province!=''? req.body.province : data.province),
            street: (req.body.street!=''? req.body.street : data.street),
            neighborhood: (req.body.neighborhood!=''? req.body.neighborhood : data.neighborhood),
        }
        db.ref('stores/'+req.params.id).set(updateUser);
    })

    res.redirect('/stores');

})

router.get('/delete-store/:id',(req, res)=>{
    db.ref('stores/'+req.params.id).remove();
    res.redirect("/stores");
})

/*Administra ventas*/


router.get('/stores', (req, res) =>{
        res.render('stores/stores')

    
})

module.exports = router;

