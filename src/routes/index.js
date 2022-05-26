const { Router } = require('express');
const router = Router();

const admin = require("firebase-admin");

const serviceAccount = require("../key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://pdp-ggg-default-rtdb.firebaseio.com"
});

const db = admin.database();

router.get('/', (req, res) =>{
    db.ref('cars').once('value', (snapshot)=>{
        const data = snapshot.val();
        res.render('index', {cars: data})
    });
    
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
    res.redirect("/");
})

router.get('/delete-car/:id',(req, res)=>{
    db.ref('cars/'+req.params.id).remove();
    res.redirect("/");
})

module.exports = router;