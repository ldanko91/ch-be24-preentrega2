import cartsModel from "../../models/carritos.js";
import productsModel from "../../models/productos.js";

export default class CartsDBManager {
    constructor(){
        console.log('Trabajando con colección carts de MongoDB')
    }

    addCart = async (newCart) =>  {
        let upload = await cartsModel.create(newCart);
        return upload
    }

    getCarts = async (req, res) => {
        try {
            let carritos = await cartsModel.find({}, { __v: 0 }).lean().populate({ path: 'products.product' });
            // res.json({ status: 'Success', payload: carritos })
            return carritos
        } catch (error) {
            console.log(error)
        }

    }
    getCartById = async(getCode)=>{
        let carritos = await cartsModel.findOne({_id:getCode}).populate({path:'products.id',model:productsModel});
        return carritos
    }

    deleteProductById  = async(cartId,prodId)=>{
        let carrito = await cartsModel.findOne({_id:cartId}).lean();
        let prodsInCart = carrito.products;
        let delIndex = prodsInCart.findIndex(producto => producto.id == prodId)
        prodsInCart.splice(delIndex,1)
        let upload = await cartsModel.updateOne({_id:cartId},prodsInCart);
        return upload
    }

    updateProducts = async(cId,products)=>{
        let carrito = await cartsModel.findOne({_id:cId}).lean();
        let prodsInCart = carrito.products;
        prodsInCart = []
        prodsInCart.push(products)
        let upload = await cartsModel.updateOne({_id:cartId},prodsInCart);
        return upload
    }

    updateQuantity  = async(cId,pId,newQtty)=>{
        let carrito = await cartsModel.findOne({_id:cId}).lean();
        let prodsInCart = carrito.products;
        let updIndex = prodsInCart.findIndex(producto => producto.id == pId)
        let updProd = prodsInCart[updIndex];
        updProd.quantity = parseInt(newQtty)
        let upload = await cartsModel.updateOne({_id:cartId},prodsInCart);
        return upload
    }

    emptyCart = async(cId)=>{
        let carrito = await cartsModel.findOne({_id:cId}).lean();
        let prodsInCart = carrito.products;
        prodsInCart = []
        let upload = await cartsModel.updateOne({_id:cartId},prodsInCart);
        return upload
    }
}