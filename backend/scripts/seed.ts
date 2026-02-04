import { Client } from 'pg';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { pool } from '../database';
import { createFiscalExpense } from './fiscal-records.seed';

// Carrega variáveis de ambiente
dotenv.config({ path: path.join(__dirname, '../../.env') });


async function seed() {
  try {
    await pool.connect();
    console.log('✅ Conectado ao banco de dados');

    // Limpar dados existentes (ordem inversa para respeitar FKs)
    console.log('\n🗑️  Limpando dados existentes...');
    await pool.query('TRUNCATE TABLE sale_items CASCADE');
    await pool.query('TRUNCATE TABLE sales CASCADE');
    await pool.query('TRUNCATE TABLE fiscal_records CASCADE');
    await pool.query('TRUNCATE TABLE supplier_payments CASCADE');
    await pool.query('TRUNCATE TABLE products CASCADE');
    await pool.query('TRUNCATE TABLE suppliers CASCADE');
    await pool.query('TRUNCATE TABLE customers CASCADE');
    await pool.query('TRUNCATE TABLE users CASCADE');

    // 1. SEED USERS
    console.log('\n👤 Criando usuários...');
    await pool.query(`
      INSERT INTO users (name, email) VALUES
      ('João Silva', 'joao.silva@example.com'),
      ('Maria Santos', 'maria.santos@example.com'),
      ('Pedro Oliveira', 'pedro.oliveira@example.com'),
      ('Ana Costa', 'ana.costa@example.com')
      ON CONFLICT (email) DO NOTHING;
    `);
    console.log('✅ 4 usuários criados');

    // 2. SEED CUSTOMERS
    console.log('\n🛍️  Criando clientes...');
    await pool.query(`
      INSERT INTO customers (name, cpf, cep, street, neighborhood, state, street_number, phone_number, email) VALUES
      ('Carlos Mendes', '12345678901', '01310100', 'Avenida Paulista', 'Bela Vista', 'SP', 1000, '(11)98765-4321', 'carlos.mendes@email.com'),
      ('Fernanda Lima', '98765432101', '20040020', 'Rua do Ouvidor', 'Centro', 'RJ', 50, '(21)99876-5432', 'fernanda.lima@email.com'),
      ('Roberto Gomes', '55555555555', '30140071', 'Rua da Bahia', 'Funcionarios', 'MG', 1200, '(31)99999-8888', 'roberto.gomes@email.com'),
      ('Juliana Ferreira', '11111111111', '40015000', 'Avenida Sete de Setembro', 'Centro', 'BA', 800, '(71)97777-6666', 'juliana.ferreira@email.com'),
      ('Gustavo Martins', '22222222222', '50010000', 'Rua Recife', 'Pina', 'PE', 420, '(81)98888-7777', 'gustavo.martins@email.com')
      ON CONFLICT (email) DO NOTHING;
    `);
    console.log('✅ 5 clientes criados');

    // 3. SEED SUPPLIERS
    console.log('\n🚚 Criando fornecedores...');
    await pool.query(`
      INSERT INTO suppliers (legal_name, active, cep, street, street_number, neighborhood, city, state, phone_number, cnpj, producer_tax_id, state_tax_id, email, cash_account, tax_regime, payment_methods, notes) VALUES
      ('Distribuidora ABC LTDA', true, '01310100', 'Avenida Brasil', 500, 'Jardins', 'São Paulo', 'SP', '(11)3333-4444', '12345678000195', NULL, '123456789', 'contato@abc-dist.com', '00000000000000000000000', 'Simples Nacional', ARRAY['Dinheiro', 'Pix', 'Cheque'], 'Fornecedor principal'),
      ('Produtos XYZ S.A.', true, '20040020', 'Rua Castelo', 100, 'Saúde', 'Rio de Janeiro', 'RJ', '(21)4444-5555', '98765432000198', 'RGP.123456789', NULL, 'vendas@xyz.com.br', '11111111111111111111111', 'Lucro Presumido', ARRAY['Cartao_debito', 'Cartao_credito', 'Pix'], NULL),
      ('Fornecedora Premium EIRELI', true, '30140071', 'Avenida Getúlio', 700, 'Savassi', 'Belo Horizonte', 'MG', '(31)5555-6666', '55555555000123', NULL, '987654321', 'info@premium.com.br', '22222222222222222222222', 'Lucro Real', ARRAY['Dinheiro', 'Cartao_credito'], 'Qualidade premium'),
      ('Importadora Global', true, '40015000', 'Rua Direita', 250, 'Comércio', 'Salvador', 'BA', '(71)6666-7777', '11111111000456', 'RGP.987654321', '555555555', 'export@global.com.br', '33333333333333333333333', 'Simples Nacional', ARRAY['Pix', 'Cheque'], NULL),
      ('Comércio Nordeste', true, '50010000', 'Avenida Maurício de Nassau', 900, 'Boa Viagem', 'Recife', 'PE', '(81)7777-8888', '22222222000789', NULL, '111111111', 'admin@nordeste.com.br', '44444444444444444444444', 'Lucro Presumido', ARRAY['Dinheiro', 'Cheque', 'Pix'], NULL)
      ON CONFLICT (cnpj) DO NOTHING;
    `);
    console.log('✅ 5 fornecedores criados');

    // 4. SEED PRODUCTS
    console.log('\n📦 Criando produtos...');
    const suppliersResult = await pool.query('SELECT cnpj FROM suppliers LIMIT 5');
    const suppliers = suppliersResult.rows;

    const products = [
      { reg_id: 'PROD001', group: 'Eletrônicos', brand: 'Samsung', desc: 'Monitor 24"', ref: 'M24-001', price: '899.90', stock: 50, type: 'Periférico', supplier: suppliers[0]?.cnpj },
      { reg_id: 'PROD002', group: 'Eletrônicos', brand: 'LG', desc: 'Teclado Mecânico', ref: 'KB-LG-001', price: '450.00', stock: 30, type: 'Periférico', supplier: suppliers[1]?.cnpj },
      { reg_id: 'PROD003', group: 'Informática', brand: 'Intel', desc: 'Processador i7', ref: 'CPU-I7-001', price: '1299.00', stock: 15, type: 'Componente', supplier: suppliers[0]?.cnpj },
      { reg_id: 'PROD004', group: 'Periféricos', brand: 'Logitech', desc: 'Mouse Sem Fio', ref: 'MOUSE-001', price: '89.90', stock: 100, type: 'Periférico', supplier: suppliers[2]?.cnpj },
      { reg_id: 'PROD005', group: 'Impressoras', brand: 'HP', desc: 'Impressora Laser', ref: 'PRINT-HP-001', price: '1599.00', stock: 8, type: 'Impressora', supplier: suppliers[3]?.cnpj },
      { reg_id: 'PROD006', group: 'Armazenamento', brand: 'Seagate', desc: 'SSD 1TB', ref: 'SSD-001TB', price: '499.00', stock: 25, type: 'Armazenamento', supplier: suppliers[1]?.cnpj },
      { reg_id: 'PROD007', group: 'Redes', brand: 'TP-Link', desc: 'Roteador Wi-Fi 6', ref: 'ROUTER-WF6', price: '349.90', stock: 40, type: 'Rede', supplier: suppliers[4]?.cnpj },
      { reg_id: 'PROD008', group: 'Cabos', brand: 'Intelbras', desc: 'Cabo HDMI 3m', ref: 'HDMI-3M', price: '29.90', stock: 150, type: 'Acessório', supplier: suppliers[2]?.cnpj }
    ];

    for (const product of products) {
      if (product.supplier) {
        await pool.query(
          `INSERT INTO products (registration_id, branch, product_group, brand, description, reference, price, stock, product_type, supplier_cnpj)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
           ON CONFLICT (registration_id) DO NOTHING`,
          [product.reg_id, 'Marilândia', product.group, product.brand, product.desc, product.ref, product.price, product.stock, product.type, product.supplier]
        );
      }
    }
    console.log(`✅ ${products.length} produtos criados`);

    // 5. SEED FISCAL RECORDS & SALES
    console.log('\n💰 Criando registros fiscais e vendas...');
    const usersResult = await pool.query('SELECT id FROM users');
    const users = usersResult.rows;
    
    const customersResult = await pool.query('SELECT id FROM customers');
    const customers = customersResult.rows;
    
    const productsResult = await pool.query('SELECT id FROM products');
    const productsDb = productsResult.rows;

    // Criar 10 vendas
    for (let i = 0; i < 10; i++) {
      const fiscalDate = new Date();
      fiscalDate.setDate(fiscalDate.getDate() - Math.floor(Math.random() * 30));
      const totalValue = (Math.random() * 5000 + 500).toFixed(2);

      // Inserir registro fiscal
      const fiscalResult = await pool.query(
        `INSERT INTO fiscal_records (date, value, movement_type, identifier, description)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id`,
        [fiscalDate, totalValue, 1, `VENDA-${i + 1}`, `Venda de produtos`]
      );
      
      const fiscalRecordId = fiscalResult.rows[0].id;
      const userId = users[Math.floor(Math.random() * users.length)].id;
      const customerId = customers[Math.floor(Math.random() * customers.length)].id;
      const paymentType = Math.floor(Math.random() * 4) + 1; // 1-4
      const saleType = Math.floor(Math.random() * 3) + 1; // 1-3

      // Inserir venda
      const saleResult = await pool.query(
        `INSERT INTO sales (fiscal_record_id, customer_id, user_id, payment_type, sale_type, status_type, total_value)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id`,
        [fiscalRecordId, customerId, userId, paymentType, saleType, 1, totalValue]
      );

      const saleId = saleResult.rows[0].id;

      // Inserir itens da venda (2-4 itens por venda)
      const itemCount = Math.floor(Math.random() * 3) + 2;
      for (let j = 0; j < itemCount; j++) {
        const product = productsDb[Math.floor(Math.random() * productsDb.length)];
        const quantity = Math.floor(Math.random() * 5) + 1;
        const unitPrice = (Math.random() * 1000 + 50).toFixed(2);

        await pool.query(
          `INSERT INTO sale_items (sale_id, product_id, quantity, unit_price)
           VALUES ($1, $2, $3, $4)`,
          [saleId, product.id, quantity, unitPrice]
        );
      }
    }
    console.log('✅ 10 vendas criadas com itens');
await createFiscalExpense({
  value: 2500.00,
  movementType: 2,
  identifier: 'ALUGUEL-01-2026',
  description: 'Pagamento de aluguel referente a janeiro',
});
await createFiscalExpense({
  value: 450.90,
  movementType: 3,
  identifier: 'DEVOLUCAO-CLIENTE-123',
  description: 'Devolução de produto com defeito',
});
    // 6. SEED SUPPLIER PAYMENTS
    console.log('\n💳 Criando pagamentos a fornecedores...');
    const suppliersDbResult = await pool.query('SELECT id FROM suppliers');
    const suppliersDb = suppliersDbResult.rows;

    const paymentTypes = ['Dinheiro', 'Cheque', 'Cartao_credito', 'Cartao_debito', 'Pix', 'Transferencia_bancaria'];
    const movementTypes = ['Entrada', 'Saida'];

    for (let i = 0; i < 15; i++) {
      const supplier = suppliersDb[Math.floor(Math.random() * suppliersDb.length)];
      const paymentDate = new Date();
      paymentDate.setDate(paymentDate.getDate() - Math.floor(Math.random() * 60));
      const amount = (Math.random() * 10000 + 1000).toFixed(2);
      const paymentType = paymentTypes[Math.floor(Math.random() * paymentTypes.length)];
      const movementType = movementTypes[Math.floor(Math.random() * movementTypes.length)];

      await pool.query(
        `INSERT INTO supplier_payments (supplier_id, payment_date, amount, payment_type, movement_type, description)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [supplier.id, paymentDate, amount, paymentType, movementType, `Pagamento de fornecedor #${i + 1}`]
      );
    }
    console.log('✅ 15 pagamentos a fornecedores criados');

    console.log('\n🎉 Seed concluído com sucesso!');
    console.log('\n📊 Resumo:');
    console.log('   ✓ 4 usuários');
    console.log('   ✓ 5 clientes');
    console.log('   ✓ 5 fornecedores');
    console.log('   ✓ 8 produtos');
    console.log('   ✓ 10 vendas com itens');
    console.log('   ✓ 15 pagamentos a fornecedores');
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao executar seed:', error);
    await pool.end();
    process.exit(1);
  }
}

seed();
