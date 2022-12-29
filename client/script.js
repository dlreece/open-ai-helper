import bot from './assets/bot.svg'
import user from './assets/user.svg'

const form = document.querySelector('form')
const chatContainer = document.querySelector('#chat_container')

let loadInterval;

// put 
function loader(element) {
    element.textContent = ''; //make sure string is empty at start

    loadInterval = setInterval(() => {
        element.textContent += '.';
        if(element.textContent === '....'){
            // return loader()
            element.textContent = ''
        }
    }, 300)
}

// get the text to appear as if typed
function typeText(element, text) {
    let index = 0

    let interval = setInterval(() => {
        if(index < text.length) {
            element.innerHTML += text.charAt(index)
            // element.textContent += text[index]
            index ++
        } else {
            clearInterval(interval)
        }
    }, 20);
}

function generateUniqueId() {
    const timestamp = Date.now()
    const randomNumber = Math.random()
    const hexadecimalString = randomNumber.toString(16)
    
    return `id-${timestamp}-${hexadecimalString}`
}

function chatStripe (isAi, value, uniqueId) {
    return (
        `
          <div class="wrapper ${isAi && 'ai'}">
            <div class="chat">
              <div className="profile">
                <img 
                  src="${isAi ? bot : user}"
                  alt="${isAi ? 'bot' : 'user'}"                  
                />
              </div>
              <div class="message" id=${uniqueId}>
                ${value}
              </div>
            </div>    
          </div>
        `
    )
}

const handleSubmit = async (e) => {
    //prevent default form behavior of reloading browser
    e.preventDefault()

    //get data from form
    const data = new FormData(form)

    //user's chatstripe
    chatContainer.innerHTML += chatStripe(false, data.get('prompt'))
    form.reset()

    //bot's chatstripe
    const uniqueId = generateUniqueId()
    chatContainer.innerHTML += chatStripe(true, " ", uniqueId)
    //keep the new message in view
    chatContainer.scrollTop = chatContainer.scrollHeight
    //fetch newly created bot div
    const messageDiv = document.getElementById(uniqueId)
    
    loader(messageDiv)
}

form.addEventListener('submit', handleSubmit)
form.addEventListener('keyup', (e) => {
    if(e.keyCode === 13) {
        handleSubmit(e)
    }
})