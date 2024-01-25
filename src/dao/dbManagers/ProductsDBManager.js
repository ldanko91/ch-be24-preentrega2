import productsModel from '../../models/productos.js'

export default class ProductsDBManager {
    constructor(){
        console.log('Conectado a MongoDB')
    }

    getProducts = async (pageq, limitq, filterByq, sortByq, sortOrderq) =>{
        console.log('Primer console log')
        console.log(pageq, limitq, filterByq, sortByq, sortOrderq)
        let productos = await productsModel.paginate({filterByq},{page:pageq,limit:limitq,lean:true,sort:([[sortByq,sortOrderq]])})
        return productos
    }

    getProductByCode = async(getCode)=>{
        let productos = await productsModel.find({code:getCode}).lean();
        return productos
    }

    addProduct = async (newProd) =>{
        let upload = await productsModel.create(newProd);
        return upload
    }

    updateProductByCode = async (updCode,updProd) =>{
        let update = await productsModel.updateOne({code:updCode},updProd);
        return update
    }

    deleteProductByCode = async (delCode) =>{
        let deleteOne = await productsModel.updateOne({code:delCode},{status:true});
        return deleteOne
    }

}
