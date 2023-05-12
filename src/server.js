const express = require("express");
const {PrismaClient} = require("@prisma/client");
const bcrypt = require("bcrypt");
// const cookieparser = require("cookie-parser")
// const { error } = require("console");

const app = express();
app.use(express.json());
// app .user(cookieparser())

const prisma = new PrismaClient()

app.listen(8080, () => {
    console.log("O servidor esta no ar ...")
})


app.post("/register" , async(req, res) =>{
    try{
        const {nome, senha} = req.body;
        await bcrypt.hash(senha, 10). then((hash) =>{
            prisma.user.create({
                data:{
                    nome: nome,
                    senha: hash,
                }
            }).then(() =>{
                res.json("Usuario criado")
            }).catch((err) =>{
                res.json({error: "Usuario ja existe"})

            })
        })

        // await prisma.user.create({
        //     data:{
        //         nome,
        //         senha,
        //     }

        // });
        // res.json("Usuario criado");
    }catch(err){
        res.json(error);
    }

});

app.post("/login", async (req, res) => {
    {
        const {nome, senha} = req.body;
        const usuario = await prisma.user.findUnique({where: {nome}});
        if(!usuario){
            res.json({error: "Algo deu errado"});
        }
        const pSenha = usuario.senha;
        bcrypt.compare(senha, pSenha).then((match)=>{
            if(!match){
                res.status(400).json({error:"senha e usuario incorretos"})
            }else{
                res.json("voce esta logado");
            }
        })
    }
})


app.get("/", async(req, res) =>{
    const usuarios = await prisma.user.findMany()
    res.json(usuarios)
})

