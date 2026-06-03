const express = require('express');
const userAuth = require('../middleware/userAuth');

const expense = require('../models/expense');
require('dotenv').config();

const exp = express.Router()

exp.post('/',userAuth,async(req,res)=>{
    try{
        //console.log(req.body);
        if(!req.body.price)
        {
            throw new Error("Price Required");
        }
        //req.body.price = Number(req.body.price);
        //console.log(req.payload);
        const {_id} = req.payload;
        if(!req.body.date)
        {
            req.body.date = Date.now();
        }
        req.body.userId = _id;
        
        console.log(req.body);
        await expense.create(req.body);
        //console.log(c);
        res.status(200).json({title:true,message:"Data Added"});
    }catch(err){
        console.log(err.message);
        res.status(500).send({title:false,message:"Error Occured"});
    }
})

exp.get("/monthlyAnalysis",userAuth,async(req,res)=>{
    try{

    const {_id} = req.payload;
    const {month,year} = req.query;
    let start,end;
    
    if(month==13)
    {
        start = new Date(year,0,1);
        end = new Date(year,11,30,23,59,59);
    }
    else
    {
        start = new Date(year,month-1,1);
        end = new Date(year,month,0,23,59,59);
    }
    
    const detail = await expense.find({
        userId:_id,
        date:{$gte:start , $lte: end}
    });
   
    //const detail2 = await expense.find({userId:_id});
    
    //console.log(detail2);
    res.status(200).json({title:true,data:detail})
    }catch(err){
        res.status(500).json({title:false,message:"Data Not Found"});
    }
})

exp.put("/:id",userAuth, async(req,res)=>{
    try{
        await expense.findByIdAndUpdate(req.params.id,req.body);
        res.status(200).send("Data Updated");
    }catch(err){
        res.status(500).send({title:"Error",message:err.message});
    }
})
exp.get("/monthly",userAuth,async(req,res)=>{
    try{

        console.log(req.query);
        const {_id} =req.payload;
        const {month,year} = req.query;
        let start,end;
        if(month==13)
        {
            start = new Date(year,0,1);

            end = new Date(year,11,31,23,59,59);
        }
        else{
            //starting date of the month
        start = new Date(year,month-1,1);

        //ending date
        end = new Date(year,month,0,23,59,59);
        }
        

        const detail = await expense.find({
        userId: _id,
        date: { $gte: start , $lte: end}
        });

        let totalIncome = 0;
        let totalExpense = 0;
        //console.log(detail)
        detail.map((item)=>{
            console.log(typeof(item.price))
            if(item.type === "income")
            {
                totalIncome+=Number(item.price)
            }
            else
            {
                totalExpense+=Number(item.price)
            }
        })

        //res.info = detail;
        data={"income":totalIncome,"expense":totalExpense,"budget":totalIncome-totalExpense}
        res.status(200).json({title:true,data:data})

    }catch(err){
        res.status(500).json({title:false,message:err.message})
    }
})

exp.get("/",userAuth,async(req,res)=>{
    try{
        const {_id} = req.payload;

        const details = await expense.find({
            userId:_id
        }).sort({date:-1}).limit(10);

        res.status(200).json({title:true,data:details});

    }catch(e){
        res.status(500).json({title:false,message:e})
    }
})

exp.get("/month",userAuth,async(req,res)=>{
    try{
        const {_id} = req.payload;
        const {month,year} = req.query;

        let start = new Date(year,month-1,1);
        let end = new Date(year,month,0,23,59,59);
        
        const detail = await expense.find({
        userId:_id,
        date:{$gte:start , $lte: end}
    });
       res.status(200).json({title:true,data:detail})

    }catch(e){
        res.status(500).json({title:false,message:e})
    }
})

exp.delete("/:id",userAuth, async(req,res)=>{
    try{
        
        await expense.findByIdAndDelete(req.params.id);
        res.status(200).json({success:true});
    }catch(err){
        res.status(500).send({title:"Error",message:err.message});
    }
})
module.exports = exp;