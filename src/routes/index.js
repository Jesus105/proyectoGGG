const { Router } = require('express');
const router = Router();

const admin = require("firebase-admin");
const { route, rawListeners } = require('../app');

const serviceAccount = require("../key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://pdp-ggg-default-rtdb.firebaseio.com"
});

const db = admin.database();

/* Obtener datos */

const get_cars = ()=>{

    let d;

    let data = db.ref('cars').once('value', (snapshot)=>{
        const data = snapshot.val();

        d = data
        console.log("in")
        console.log(d)

    
    });

    console.log("out: ")
    console.log(d)
    


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

/* Obtener valores de diferentes tablas */
router.get('/sells', getStores, getCars, getUsers, getSells, renderFrom);

function getStores(req, res, next) {
    db.ref('stores').once('value', (snapshot) => {
        res.locals.stores = snapshot.val();
        next();
    });
}

function getCars(req, res, next) {
    db.ref('cars').once('value', (snapshot) => {
        res.locals.cars = snapshot.val();
        next();
    });
}

function getUsers(req, res, next) {
    db.ref('users').once('value', (snapshot) => {
        res.locals.users = snapshot.val();
        next();
    })
}

function getSells(req, res, next) {
    db.ref('sells').once('value', (snapshot) => {
        res.locals.sells = snapshot.val()
        next();
    })
}

function getSell(req, res, next) {
    db.ref('sells/'+req.params.id).once('value', (snapshot)=>{
        const data = snapshot.val();
        data.id = req.params.id;
        res.locals.sell = data;
        next();
    })
}

function renderFrom(req, res) {
    res.render('sells/sells')
}


/* Realizar las demás acciones de ventas */

router.post('/new-sell', (req,res)=>{
    console.log(req.body);
    const newSell = {
        store: req.body.stores,
        car: req.body.cars,
        client: req.body.users,
        pay: req.body.pay
    }
    db.ref('sells').push(newSell);
    res.redirect("/sells");
})

router.get('/get-sell/:id', getStores, getCars, getUsers, getSells, getSell, renderUpdate);

function renderUpdate(req, res) {
    res.render('sells/update-sells')
}

router.post('/update-sell/:id', (req,res)=>{

    db.ref('sells/'+req.params.id).once('value', (snapshot)=>{
        const data = snapshot.val();
        const updateSell = {
            store: (req.body.stores!=''? req.body.stores : data.store),
            car: (req.body.cars!=''? req.body.cars : data.car),
            client: (req.body.users!=''? req.body.users : data.client),
            pay: (req.body.pay!=''? req.body.pay : data.pay),
        }
        db.ref('sells/'+req.params.id).set(updateSell);
    })

    res.redirect('/sells');

})

router.get('/delete-sell/:id',(req, res)=>{
    db.ref('sells/'+req.params.id).remove();
    res.redirect("/sells");
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
    if(req.body.brand !='' && req.body.model !='' && req.body.year !='' && req.body.color !='' && req.body.quantity !='' && req.body.type !='' && req.body.price !=''){
        console.log(req.body);
        const newCar = {
            brand: req.body.brand,
            model: req.body.model,
            year: req.body.year,
            color: req.body.color,
            quantity: req.body.quantity,
            type: req.body.type,
            price: req.body.price
        }
        db.ref('cars').push(newCar);
        res.redirect("/cars");
    } else{
        db.ref('cars').once('value', (snapshot)=>{
            const data = snapshot.val();
            res.render('cars/new-cars', {cars: data, car: req.body})
        });

    }
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
        const updateCar = {
            brand: (req.body.brand!=''? req.body.brand : data.brand),
            model: (req.body.model!=''? req.body.model : data.model),
            year: (req.body.year!=''? req.body.year : data.year),
            color: (req.body.color!=''? req.body.color : data.color),
            quantity: (req.body.quantity!=''? req.body.quantity : data.quantity),
            type: (req.body.type!=''? req.body.type : data.type),
            price: (req.body.price!=''? req.body.price : data.price)
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

    let e = true

    if(req.body.name != '' && req.body.age != '' && req.body.email != '' && req.body.phone != '' && req.body.state != '' && req.body.s_number != ''){
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
    } else{
        db.ref('users').once('value', (snapshot)=>{
            const data = snapshot.val();
            res.render('users/new-user', {users: data, user: req.body})
        });
        
    }

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

    if(req.body.name != '' && req.body.street != '' && req.body.neighborhood != '' && req.body.cp != '' && req.body.province != '' && req.body.phone != ''){

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
        
    }else{

        db.ref('stores').once('value', (snapshot)=>{
            const data = snapshot.val();
            console.log(req.body)
            res.render('stores/new-store', {stores: data, store: req.body})
        });

    }

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


/*Administra agencias */

router.get('/stores', (req, res) =>{
        res.render('stores/stores')

    
})

module.exports = router;

