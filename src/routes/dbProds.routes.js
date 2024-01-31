import { Router, json } from "express";
import ProductsDBManager from "../dao/dbManagers/ProductsDBManager.js";

const dbProdsRouter = Router();
const DBProdsManager = new ProductsDBManager();

dbProdsRouter.get('/', async(req,res)=>{    
    let pageq = parseInt(req.query.page) || 1;
    let limitq = parseInt(req.query.limit) || 10;
    const filterByq = req.query.filterBy
    console.log(filterByq)
    const sortByq = req.query.sortBy || "price";
    const sortOrderq = req.query.sortOrder || "asc";

    const { docs, page, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage } = await DBProdsManager.getProducts(pageq, limitq, filterByq, sortByq, sortOrderq);
    console.log(page, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage)
    const productos = docs
    console.table(productos)
    res.render('products', {
        productos, page, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage,
        title: "Listado de productos"
    })
})

dbProdsRouter.get('/:pcod', async(req,res)=>{
    let {pcod} = req.params
    let productos = await DBProdsManager.getProductByCode(pcod);
    console.log(productos);
    res.render('productDetail', {
        productos,
        title: `${productos[0].title} código ${pcod}`
    })
})

dbProdsRouter.post('/', async(req,res)=>{
    let {code, title, description, price, thumbnail, stock, category} = req.body;
    let newProd = {code, title, description, price, thumbnail, stock, category};
    let upload = await DBProdsManager.addProduct(newProd);
    res.send({status:"success", payload:upload})
})

dbProdsRouter.put('/:pid', async(req,res)=>{
    let {title, description, price, thumbnail, stock, category} = req.body;
    let updProd = {title, description, price, thumbnail, stock, category};
    let {pid} = req.params
    let update = await DBProdsManager.updateProductByCode(pid,updProd);
    res.send({status:"success", payload:update})
})

dbProdsRouter.delete('/:pid', async(req,res)=>{
    let {pid} = req.params
    let delProd = await DBProdsManager.deleteProductByCode(pid);
    res.send({status:"success", payload:delProd})
})

export default dbProdsRouter;