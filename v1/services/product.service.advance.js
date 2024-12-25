// model
const { Product, Clothing, Electronic, Furniture } = require('../models/product.model');

// core
const { BadRequestError } = require('../core/error.response');

// định nghĩa Class Product
class ProductClass {

    // hàm tạo
    constructor ({
        product_name,     product_thumb, product_description, product_price,
        product_quantity, product_type,  product_shop,        product_attributes
    }) {
        this.product_name = product_name;
        this.product_thumb = product_thumb;
        this.product_description = product_description;
        this.product_price = product_price;
        this.product_quantity = product_quantity;
        this.product_type = product_type;
        this.product_shop = product_shop;
        this.product_attributes = product_attributes;
    }

    // tạo sản phẩm mới
    // createProduct = async () => await Product.create(this);
    async createProduct (product_id) {
        return await Product.create({
            ...this,
            _id: product_id // id của bản ghi  này chính là id của cái attribute cụ thể được tạo ví dụ _id của Clothing hay _id của Electronics
        });
    }
}

// định nghĩa sub-class Clothing kế thừa Product
class ClothingClass extends ProductClass {
    // tạo quần áo mới
    createProduct = async () => {
        // [1] tạo attribute
        const newClothing = await Clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop // lưu id của user/shop tạo Clothing này
        });
        if(!newClothing) throw new BadRequestError('Tạo Quần Áo Thất Bại'); 
        
        
        // [2] tạo product cha
        const newProduct = await super.createProduct(newClothing._id);
        if(!newProduct) throw new BadRequestError('Tạo Sản Phẩm Thất Bại');
        
        console.log('newProduct:::', newProduct);
        return newProduct;
    }
}

// định nghĩa sub-class Electronics kế thừa Product
class ElectronicClass extends ProductClass {
    // tạo đồ điện tử mới
    createProduct = async () => {
        // [1] tạo attribute, 
        const newElectronic = await Electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop // lưu id của user/shop tạo Electronics này
        });
        if(!newElectronic) throw new BadRequestError('Tạo Đồ Điện Thất Bại'); 
        
        
        // [2] tạo product cha => tức bản ghi chung về thông tin
        const newProduct = await super.createProduct(newElectronic._id);
        if(!newProduct) throw new BadRequestError('Tạo Sản Phẩm Thất Bại');
        
        return newProduct;
    }
}

// định nghĩa sub-class Furniture kế thừa Product
class FurnitureClass extends ProductClass {
    // tạo đồ nội thất mới
    createProduct = async () => {
        // [1] tạo attribute, 
        const newFurniture = await Furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop // lưu id của user/shop tạo Electronics này
        });
        if(!newFurniture) throw new BadRequestError('Tạo Đồ Điện Thất Bại'); 
        
        
        // [2] tạo product cha => tức bản ghi chung về thông tin
        const newProduct = await super.createProduct(newFurniture._id);
        if(!newProduct) throw new BadRequestError('Tạo Sản Phẩm Thất Bại');
        
        return newProduct;
    }
}

// sử dụng simple factory pattern
class ProductFactory {

    static productRegisty = {}; // key - class

    static registerProductType (type, classRef) {
        ProductFactory.productRegisty[type] = classRef
    }

    static async createProduct (type, payload) {
        const productClass = ProductFactory.productRegisty[type];
        if(!productClass) throw new BadRequestError('no no no');

        return new productClass( payload ).createProduct();
    }
}

// đăng ký các class
ProductFactory.registerProductType('Electronics', ElectronicClass);
ProductFactory.registerProductType('Clothing', ClothingClass);
ProductFactory.registerProductType('Furniture', FurnitureClass);

module.exports = ProductFactory;

// sự kết hợp của Factory Pattern và Strategy Pattern