const selectorOne = document.getElementById("selectorOne");
const selectorTwo = document.getElementById("selectorTwo");
const exchangeParam = document.getElementById("exchangeParam");
const exchangeResult = document.getElementById("exchangeResult");
const waringText = document.querySelector('[data-js="currencies-container"]')

let internalExchangeRate = {}


const getUrl = currency => `https://v6.exchangerate-api.com/v6/9976279451861a842fd9a67b/latest/${currency}`

const getErrorMessage = errorType => ({
    "unsupported-code": "Há moeda nao existe no banco de dados",
    "malformed-request": "quando alguma parte de sua solicitação não segue a estrutura mostrada acima.",
    "invalid-key": "quando sua chave API não é válida.",
    "inactive-account": "se o seu endereço de e- mail não foi confirmado.",
    "quota-reached": "quando sua conta atingir o número de solicitações permitidas por seu plano.",
})[errorType] || "Erro desconhecido"

const fetchExchangeRate = async url => {
    try {
        const result = await fetch(url);

        // if (!result.ok) {
        //     throw new Error("sua conexao falhou")
        // }

        const resultFormat = await result.json();

        if (resultFormat.result === "error") {
            throw new Error(getErrorMessage(resultFormat["error-type"]))
        } else {
            return resultFormat;
        }
    } catch (error) {
        console.log(waringText)
        const div = document.createElement("div")
        const button = document.createElement("button")

        div.textContent = error.message

        div.classList.add("alert", "alert-warning", "alert-dismissible", "fade", "show", "button-alert");
        // div.setAtribute("role", "alert")


        button.classList.add("btn-close")
        button.setAttribute("type", "button")
        button.setAttribute("aria-label", "Close")


        div.addEventListener('click', () => {
            div.remove();
        })

        div.appendChild(button)
        waringText.insertAdjacentElement('afterend', div)

    }
}

const init = async () => {

    internalExchangeRate = { ...await fetchExchangeRate(getUrl("USD")) }

    const getOptions = selectedCurrency => Object.keys(internalExchangeRate.conversion_rates)
        .map(currency => `<option ${currency === selectedCurrency ? 'selected' : ''}> ${currency} </option>`)
        .join('')

    selectorOne.innerHTML = getOptions('USD');
    selectorTwo.innerHTML = getOptions('BRL');

    // exchangeResult.value = internalExchangeRate.conversion_rates.BRL.toFixed(2);

    exchangeParam.addEventListener('input', () => {
        // console.log(internalExchangeRate.conversion_rates[selectorTwo.value]);
        exchangeResult.value = exchangeParam.value * internalExchangeRate.conversion_rates[selectorTwo.value];
    })
    selectorOne.addEventListener('input', async (e) => {
        const internalExchangeRate = { ...(await fetchExchangeRate(getUrl(e.target.value))) }
        exchangeResult.value = await exchangeParam.value * internalExchangeRate.conversion_rates[selectorTwo.value];

    })
    selectorTwo.addEventListener('input', e => {
        const currencyTwoValue = internalExchangeRate.conversion_rates[e.target.value];
        exchangeResult.value = exchangeParam.value * currencyTwoValue;
    })

}



init();
