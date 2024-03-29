/**
 * Купюра, которая обязательно должна быть выдана по запросу.
 */
const mandatory = 2000;

/**
 * Минимальный номинал купюры для размена.
 */
const minimumFaceValue = 50;

/**
 * Массив в которые будут помещены купюры при размене числа.
 */
let cashArr = [];

/**
 * Корзина, в которую мы положим купюры.
 */
let basket = [];

/**
 * Настроить банк.
 * @param {array} parArr Массив номинала.
 */
function setBank(parArr) {
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
  // Я понимаю, что while рискованный выбор, но в данном случае, с учетом условий задачи, ограничений входящих параметров и решения в целом, он защищен от риска уйти в бессконечную итерацию.
  while (!isFound) {
    const index = getRandomNum(0, basket.length - 1);
    const isBalanceMinimal = checkMinimumBills(amount);
    bill = basket[index];

    if (bill.sum <= amount && bill.count > 0 && isBalanceMinimal) {
      bill.count--;
      cashArr.push(bill.sum);
      isFound = true;
    } else if (!isBalanceMinimal) {
      console.log({BASKET: basket, RESIDUAL: amount});
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
 * @param {number} sum сумма к выдачи
 * @param {array} parArr массив номинала
 */
function cashDispenser(sum = 92300, parArr = [5000, mandatory, 1000, 100, minimumFaceValue]) {
  if (!sum || sum < mandatory || sum % minimumFaceValue > 0)
    throw new Error(
      `Передано невалидное число, число должно быть более ${mandatory} и кратным ${minimumFaceValue}!`
    );
  if (!parArr || parArr.length < 4)
    throw new Error("Корзина должна состоять из 5 купюр разного номинала!");

  // Это обязательное условие при кратности, иначе, мы не сможем выдать всю сумму.
  if (parArr.filter((nal) => nal === minimumFaceValue).length === 0) 
    throw new Error(`Корзина должна содержать номинал ${minimumFaceValue}!`);

  // Это соответствует условию задачи.
  if (parArr.filter((nal) => nal === mandatory).length === 0) 
    throw new Error(`Корзина должна содержать номинал ${mandatory}!`);

  // Это соответствует условию задачи, иначе мы не сможем выдать всю сумму из кратности 50.
  if (parArr.filter((nal) => nal < minimumFaceValue).length > 0) 
    throw new Error(`Корзина не может содержать номинал ниже ${minimumFaceValue}!`);

  setBank(parArr);

  let amount = sum;

  cashArr.push(mandatory);
  amount -= mandatory;
  // Я понимаю, что while рискованный выбор, но в данном случае с учетом условий задачи, ограничений входящих параметров и решения в целом, он защищен от риска уйти в бессконечную итерацию, просто запустите скрипт и убедитесь.
  while (amount >= minimumFaceValue) {
    amount -= change(amount);
  }

  console.log({ cach: cashArr, amount });
}

/**
 * Функция для тестирования логики.
 */
function testCashDispenser() {
  setInterval(() => {
    let sum = 0;
    do {
      sum = getRandomNum(mandatory, 100000);
    } while (sum % minimumFaceValue != 0);

    console.log(`AMOUNT OF MONEY FOR ISSUANCE: ${sum}`);
    
    try {
      cashDispenser(sum, [1000, 300, 50, 2000, 5000]);
    } catch (error) {
      console.error(error.message);
    }
  }, 1000);
}

testCashDispenser();