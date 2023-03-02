const lengthDisplay = document.querySelector('[data-lengthNumber]')
const inputSlider = document.querySelector('[data-lengthSlider]')
const passwordDisplay = document.querySelector('[data-passwordDisplay]')
const copyBtn = document.querySelector('[data-copy]')
const copyMsg = document.querySelector('[data-copyMsg]')
const upperCaseCheck = document.querySelector('#uppercase')
const lowerCaseCheck = document.querySelector('#lowercase')
const numbersCheck = document.querySelector('#numbers')
const symbolsCheck = document.querySelector('#symbols')
const indicator = document.querySelector('[data-indicator]')
const generateBtn = document.querySelector('.generateButton')
const allCheckBox = document.querySelectorAll('input[type=checkbox]')
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';
let password = " ";
let passwordLength = 10;
let checkCount = 0;
setIndicator('#ccc')
handleSlider()

// set password length 
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerHTML = passwordLength;
    const max = inputSlider.max;
    const min = inputSlider.min;
    inputSlider.style.backgroundSize = ((passwordLength - min) * 100 / (max -  min)) + "% 100%";
}

function setIndicator(color) {
     indicator.style.backgroundColor = color;
     indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
    return getRndInteger(0,9)
}

function generateLowerCase() {
    return String.fromCharCode(getRndInteger(97,123)) 
}

function generateUpperCase() {
    return String.fromCharCode(getRndInteger(65,91))
}

function generateSymbols() {
    let randomIndex = getRndInteger(0,symbols.length);
    return symbols.charAt(randomIndex);
}

function calculateStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasSym = false;
    let hasNum = false;

    if(lowerCaseCheck.checked) hasLower = true;
    if(upperCaseCheck.checked) hasUpper = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;

    if(hasLower && hasUpper && (hasNum || hasSym) && passwordLength >=8) {
        setIndicator('#0f0')
    } else if((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6) {
        setIndicator('#ff0')
    } else {
        setIndicator('#f00')
    }
}

async function copyContent() {
   try{
    await navigator.clipboard.writeText(passwordDisplay.value)
    copyMsg.innerText = 'Copied';
   }catch (error) {
     copyMsg.innerText = 'Copy failed'
   }

//  to make copy span visible

copyMsg.classList.add('active')

// to hide copyspan after 2 second

setTimeout(() => {
    copyMsg.classList.remove('active')
},2000)

}

// input slider
inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider()
})

// copy message when click button is clicked.
copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value.length >= 1) {
        copyContent();
    }
})

function handleCheckBoxChange() {
    checkCount = 0;
   
    allCheckBox.forEach((checkbox) => {
        if(checkbox.checked) {
            checkCount++;
        }

        if(passwordLength < checkCount) {
            passwordLength = checkCount;
            handleSlider()
        }
    })
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange)
})

// Suffling password using - Fisher Yates Method
function sufflePassword(sufflePassword) {
        for (let i = sufflePassword.length - 1; i > 0; i--) {
        // this line finds j using random function
          const j = Math.floor(Math.random() * (i + 1));
        //   swap i and j index
          const temp = sufflePassword[i];
          sufflePassword[i] = sufflePassword[j];
          sufflePassword[j] = temp;
        }
        let str = "";
        sufflePassword.forEach((el) => (str += el))
        return str
}

generateBtn.addEventListener('click', () => {
    password = " ";
    passwordDisplay.value = "";

    if(checkCount <= 0) {
        setIndicator('#fff')
    }

    if(checkCount <= 0) return ;
    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider()
    }

   

    // if(upperCaseCheck.checked) {
    //     password += generateUpperCase()
    // }

    // if(lowerCaseCheck.checked) {
    //     password += generateLowerCase()
    // }

    // if(numbersCheck.checked) {
    //     password += generateRandomNumber()
    // }

    // if(symbolsCheck.checked) {
    //     password += generateRandomNumber()
    // }

    let funcArr = [];

    if(upperCaseCheck.checked)
        funcArr.push(generateUpperCase)
    if(lowerCaseCheck.checked)
        funcArr.push(generateLowerCase)
    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber)
    if(symbolsCheck.checked)
        funcArr.push(generateSymbols)

    for(let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }

    for(let i = 0; i < passwordLength - funcArr.length; i++) {
        let randIndex = getRndInteger(0,funcArr.length)
        
        password += funcArr[randIndex]()
    }
    
     
    
    // shuffle the password
    password = sufflePassword(Array.from(password))
   
    // show in UI
    passwordDisplay.value = password;

    // calculate Strength
    calculateStrength()
})