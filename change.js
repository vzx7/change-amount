/**
 * Купюра, которая обязательно должна быть выдана по запросу.
 */
const mandatory = 2000;
/**
 * Массив в которые будут помещены купюры при размене числа.
 */
let cashArr = [];
/**
 * Корзина, в которую мы положим купюры.
 */
let basket = [];
/**
 * Минимальный номинал купюры для размена.
 */
let minimumFaceValue = 50;

/**
 * Настроить корзину.
 * @param {array} parArr
 */
function setBank(parArr) {
  minimumFaceValue = Math.min(...parArr);
  cashArr = [];
  basket = [];
  parArr.forEach(bill => {
    basket.push({ sum: bill, count: getRandomNum(1, 100) });
  });
}

/**
 * Произвести размен купюр.
 * @param {number} amount сумма.
 */
function change(amount) {
  let bill = null;
  let isFound = false;
  // Я понимаю, что while рискованный выбор, но в данном случае, с учетом условий задачи, ограничений входящиз параметров и решения в целом, он защищен от риска уйти в бессконечную итерацию.
  while (!isFound) {
    const index = getRandomNum(0, basket.length - 1);
    const isBalanceMinimal = checkMinimumBills(amount);
    bill = basket[index];

    if (bill.sum <= amount && bill.count > 0 && isBalanceMinimal) {
      bill.count--;
      cashArr.push(bill.sum);
      isFound = true;
    } else if (!isBalanceMinimal) {
      console.log(basket, `RESIDUAL: ${amount}`);
      throw new Error("Извините, мы не можем выдать вам всю сумму, в корзине нет купюр нужного номнинала!");
    }
  }

  return bill.sum;
}

/**
 * Проверить наличие минимальной купюры в корзине.
 * @param {number} amount сумма.
 */
function checkMinimumBills(amount) {
  return basket.find(bill => bill.sum <= amount && bill.count > 0);
}

/**
 * Получить рандомное число от min до max.
 * @param {number} min
 * @param {number} max
 */
function getRandomNum(min, max) {
  return +(Math.random() * (+min - +max) + +max).toFixed();
}

/**
 * Выдать купюры по запросу.
 * @param {number} sum
 * @param {array} parArr
 */
function cashDispenser(sum = 92300, parArr = [5000, mandatory, 1000, 100, 50]) {
  if (!sum || sum < mandatory || sum % 50 > 0)
    throw new Error(
      "Передано невалидное число, число должно быть более 2000 и кратным 50!"
    );
  if (!parArr || parArr.length < 4)
    throw new Error("Корзина должна состоять из 5 купюр разного номинала!");

  setBank(parArr);

  let amount = sum;

  cashArr.push(mandatory);
  amount -= mandatory;
  // Я понимаю, что while рискованный выбор, но в данном случае с учетом условий задачи, ограничений входящиз параметров и решения в целом, он защищен от риска уйти в бессконечную итерацию.
  while (amount >= minimumFaceValue) {
    const bill = change(amount);
    amount -= bill;
  }

  console.log({ cach: cashArr, amount });
}

/**
 * Функция для тестирования логики.
 */
function testcashDispenser() {
  setInterval(() => {
    let sum = 0;
    do {
      sum = getRandomNum(2000, 100000);
    } while (sum % 50 != 0);

    console.log(`AMOUNT OF MONEY FOR ISSUANCE: ${sum}`);
    
    try {
      cashDispenser(sum);
    } catch (error) {
      console.error(error.message);
    }
  }, 1000);
}

testcashDispenser();