import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import Product from "../../../domain/product/entity/product";
import { InputListProductDto, OutputListProductDto } from "./list.product.dto";
import ListProductUseCase from "./list.product.usecase";

describe("Test find product use case", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        sequelize.addModels([ProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should find a product", async () => {
        const productRepository = new ProductRepository();
        const usecase = new ListProductUseCase(productRepository);

        const product1 = new Product("123", "Car", 1000);
        const product2 = new Product("124", "Bike", 500);

        await productRepository.create(product1);
        await productRepository.create(product2);

        const input = {} as InputListProductDto;

        const output = {
            products: [
                {
                    id: "123",
                    name: "Car",
                    price: 1000
                },
                {
                    id: "124",
                    name: "Bike",
                    price: 500
                }
            ]
        } as OutputListProductDto;

        const result = await usecase.execute(input);

        expect(result).toEqual(output);
    });
});
