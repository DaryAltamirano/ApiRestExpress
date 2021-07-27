const express =require('express');
const Iniciodebug =require('debug')('app:inicio');
const DBInicio =require('debug')('app:database');
const Joi = require('joi');
const config = require('config');
const morgan = require('morgan');


const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(function(req,res,next){
    console.log('Loading');
    next(); 
});

// Middleware de terceros
if(app.get('env')=== 'development'){
    app.use(morgan('tiny'));
    Iniciodebug("morgan iniciado");
}
console.log(app.get('env'));
// Config de entornos
console.log('Aplication'+config.get('nombre'));
console.log('BD server'+config.get('configDB.host'));



DBInicio("Base de datos conectada");


const usuarios = [
    {id:1,nombre:"nombre"},
    {id:2,nombre:"nombre1"},
    {id:3,nombre:"nombre2"}
]
    
app.get('/api/usuario',(req,res)=>{
    res.send(usuarios);
});


app.get('/:id', (req,res)=>{
    let usuarioa = usuarios.find(u=>u.id== parseInt(req.params.id));
    if(!usuarioa) res.status(404).send('El usuario no fue encontrado');
    res.status(200).send(usuarioa);
});

app.post('/api/usuario', (req,res)=>{
    const schema = Joi.object({nombre: Joi.string().min(3).max(30).required()})
    const {value,error}=schema.validate({ nombre: req.body.nombre });
    if(!error){
        const createusuario = {
            id: usuarios.length + 1,
            nombre: value.nombre
        }
        usuarios.push(createusuario);
    
        res.status(201).send(createusuario);
    }else{  
        const mensaje = error.details[0].message;
        res.status(400).send(mensaje);

    }
    
});


app.put('/api/usuario/:id',(req,res)=>{
    let usuario = Userexists(req.params.id);
    if(!usuario) {
        res.status(404).send('El usuario no fue encontrado');
        return;
    }
    const {value,error}=validateUser(req.body.nombre);

    if(error){
        const mensaje = error.details[0].message; 
        res.status(400).send(mensaje);
    }else{
        usuario.nombre = value.nombre;
        res.send(usuario);
    }

});


app.delete('/api/usuario/:id',(req,res)=>{
    let usuario = Userexists(req.params.id);
    if(!usuario) {
        res.status(404).send('El usuario no fue encontrado');
        return;
    }

    const index= usuarios.indexOf(usuario);
    usuarios.splice(index,1);

    res.send(usuario);


});




function Userexists(id){
    return usuarios.find(u => u.id == parseInt(id))
}


function validateUser(nom){
    const schema = Joi.object({nombre:Joi.string().min(3).required()});
    return schema.validate({ nombre: nom });
}
const port = process.env.PORT || 3000;

app.listen(port,()=>{
console.log(`Conectado la puerto ${port}`);
}); 