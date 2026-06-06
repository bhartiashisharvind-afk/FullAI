const amountInput = document.getElementById("amount");
const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");
const convertBtn = document.getElementById("convertBtn");
const rateBox = document.getElementById("rateBox");
const resultBox = document.getElementById("resultBox");
const swapBtn = document.getElementById("swapBtn");
const darkModeToggle = document.getElementById("darkModeToggle");

/* =========================
   DARK MODE
========================= */

if(localStorage.getItem("theme")==="dark"){
    document.body.classList.add("dark-mode");
    darkModeToggle.checked=true;
}

darkModeToggle.addEventListener("change",()=>{

    document.body.classList.toggle("dark-mode");

    localStorage.setItem(
        "theme",
        document.body.classList.contains("dark-mode")
            ? "dark"
            : "light"
    );
});

/* =========================
   CURRENCIES
========================= */

const currencies = [
"USD","EUR","INR","GBP","JPY","AUD","CAD","CHF",
"CNY","HKD","SGD","NZD","SEK","NOK","DKK","ZAR",
"BRL","MXN","RUB","AED","SAR","QAR","KWD","BHD",
"OMR","TRY","THB","MYR","IDR","KRW","PKR","BDT",
"LKR"
];

function loadCurrencies(){

    currencies.forEach(currency=>{

        const option1=document.createElement("option");
        option1.value=currency;
        option1.textContent=currency;

        const option2=option1.cloneNode(true);

        fromCurrency.appendChild(option1);
        toCurrency.appendChild(option2);
    });

    fromCurrency.value="USD";
    toCurrency.value="INR";
}

/* =========================
   EXCHANGE RATE
========================= */

async function getRate(){

    const from=fromCurrency.value;
    const to=toCurrency.value;

    try{

        const response=await fetch(
            `https://open.er-api.com/v6/latest/${from}`
        );

        const data=await response.json();

        const rate=data.rates[to];

        rateBox.innerHTML=
            `1 ${from} = ${rate.toFixed(4)} ${to}`;

        return rate;

    }catch(error){

        rateBox.innerHTML=
            "Failed to load exchange rate";

        console.error(error);
    }
}

/* =========================
   CONVERT
========================= */

async function convertCurrency(){

    const amount=Number(amountInput.value);

    if(!amount || amount<=0){

        resultBox.innerHTML=
            "⚠️ Please enter a valid amount.";

        return;
    }

    const rate=await getRate();

    if(!rate) return;

    const converted=amount*rate;

    resultBox.innerHTML=`
        ${amount} ${fromCurrency.value}
        <br><br>
        =
        <br><br>
        <strong>
            ${converted.toFixed(2)}
            ${toCurrency.value}
        </strong>
    `;
}

/* =========================
   SWAP
========================= */

swapBtn.addEventListener("click",async()=>{

    const temp=fromCurrency.value;

    fromCurrency.value=toCurrency.value;
    toCurrency.value=temp;

    await getRate();
});

/* =========================
   EVENTS
========================= */

convertBtn.addEventListener(
    "click",
    convertCurrency
);

fromCurrency.addEventListener(
    "change",
    getRate
);

toCurrency.addEventListener(
    "change",
    getRate
);

/* =========================
   INIT
========================= */

loadCurrencies();
getRate();