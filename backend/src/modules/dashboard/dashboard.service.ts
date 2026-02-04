import { ProductService } from "../product/product.service";
import { SaleService } from "../sale/sale.service";
import { SupplierService } from "../supplier/supplier.service";


const productService = new ProductService();
const salesService = new SaleService();
const supplierService = new SupplierService();

export class DashboardService {


    private handlePagamentType(movementType: number){
        switch(movementType){
            case 1:
                return 'PIX';
            case 2:
                return 'CREDITO';
            case 3:
                return 'DEBITO';
            case 4:
                return 'DINHEIRO';
            case 5:
                return 'CHEQUE';
            default:
                return 'PIX';
        }

    }

async getDashboardData() {
    
    let totalSales = 0;
    let totalExpenses = 0;
    let payment = {['PIX']: 0, ['CREDITO']: 0, ['DEBITO']: 0, ['DINHEIRO']: 0, ['CHEQUE']: 0};
    const expenses = await salesService.listFiscalRecords();
    const sales = await salesService.listSales();
    const salesTotalPerMonth = expenses.reduce((acc: Record<number, number>, fiscalRecord) => {
        const month = new Date(fiscalRecord.date).getMonth() + 1;
        if (!acc[month]) {
            acc[month] = 0;
        }
        const sale = sales.find(s => s.fiscal_record_id === fiscalRecord.id);
        if (!!sale) {
            const paymentType = this.handlePagamentType(sale.payment_type);
            payment[paymentType] += fiscalRecord.value ? parseFloat(fiscalRecord.value.toString()) : 0;

        }
        const isEntry = fiscalRecord.movement_type === 1; 
        const value = fiscalRecord.value ? parseFloat(fiscalRecord.value.toString()) : 0;
        acc[month] = isEntry ? acc[month] + value : acc[month] - value;
        totalExpenses += isEntry ?  0 : value;
        totalSales += isEntry ? value : 0;
        return acc;
    }, {});

    const paymentsPercentage = Object.keys(payment).map(key => ({
        type: key,
        amount: payment[key as keyof typeof payment],
        percentage: totalSales > 0 ? (payment[key as keyof typeof payment] / totalSales) * 100 : 0
    }));

    const movimentationPerMonth = Object.keys(salesTotalPerMonth).map(month => ({
        month: parseInt(month),
        total: salesTotalPerMonth[Number(month)],
       
    }));




    return {
        totalSales,
        totalExpenses,
        movimentationPerMonth,
         payment: paymentsPercentage
    }

}
}
