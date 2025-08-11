import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("products").del();

  await knex("products").insert([
    { name: "Lasanha bolonhesa", price: 55.9 },
    { name: "Salada Caesar", price: 32.5 },
    { name: "Hambúrguer artesanal", price: 42.0 },
    { name: "Pizza margherita média", price: 48.75 },
    { name: "Pizza pepperoni média", price: 52.3 },
    { name: "Sopa de legumes", price: 28.4 },
    { name: "Tábua de frios", price: 85.0 },
    { name: "Brownie com sorvete", price: 27.9 },
    { name: "Mousse de maracujá", price: 22.5 },
    { name: "Cheesecake frutas vermelhas", price: 29.8 },
    { name: "Café expresso", price: 6.0 },
    { name: "Chá gelado", price: 9.5 },
    { name: "Água mineral sem gás", price: 5.0 },
    { name: "Suco de abacaxi 440ml", price: 11.2 },
    { name: "Risoto de camarão", price: 79.9 },
    { name: "Risoto de cogumelos", price: 63.45 },
    { name: "Filé mignon molho madeira", price: 95.0 },
    { name: "Frango xadrez", price: 58.25 },
    { name: "Wrap de frango", price: 33.6 },
    { name: "Sanduíche vegetariano", price: 31.1 },
  ]);
}
