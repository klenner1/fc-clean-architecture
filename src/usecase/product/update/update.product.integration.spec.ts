import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import Product from "../../../domain/product/entity/product";
import UpdateProductUseCase from "./update.product.usecase";
import { InputUpdateProductDto, OutputUpdateProductDto } from "./update.product.dto";

describe("Test update product use case", () => {
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

    it("should update a product", async () => {
        const productRepository = new ProductRepository();
        const usecase = new UpdateProductUseCase(productRepository);

        const product = new Product("123", "Car", 1000);

        await productRepository.create(product);

        const input = {
            id: "123",
            name: "Car",
            price: 1000,
        } as InputUpdateProductDto;

        const output = {
            id: expect.any(String),
            name: "Car",
            price: 1000,
        } as OutputUpdateProductDto;

        const result = await usecase.execute(input);

        expect(result).toEqual(output);
    });
});
