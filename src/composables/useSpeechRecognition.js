import { ref } from 'vue'

export function useSpeechRecognition() {
  const isListening = ref(false)
  const transcript = ref('')
  const error = ref('')

  // Vérifier la support du navigateur
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  
  if (!SpeechRecognition) {
    error.value = 'La saisie vocale n\'est pas supportée par votre navigateur'
    return { isListening, transcript, error, startListening: () => {} }
  }

  const recognition = new SpeechRecognition()
  recognition.lang = 'fr-FR'
  recognition.continuous = false
  recognition.interimResults = true

  recognition.onstart = () => {
    isListening.value = true
    transcript.value = ''
    error.value = ''
  }

  recognition.onresult = (event) => {
    let interim = ''
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const text = event.results[i].transcript
      if (event.results[i].isFinal) {
        transcript.value = text.toLowerCase()
      } else {
        interim += text
      }
    }
  }

  recognition.onerror = (event) => {
    error.value = `Erreur vocale: ${event.error}`
  }

  recognition.onend = () => {
    isListening.value = false
  }

  /*function startListening() {
    recognition.start()
  }*/

    function startListening() {
  // Demander la permission du micro d'abord
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then((stream) => {
      console.log('🎤 Micro autorisé')
      stream.getTracks().forEach(track => track.stop()) // Arrêter après vérification
      recognition.start()
    })
    .catch((error) => {
      console.error('Erreur micro:', error)
      error.value = 'Microphone non autorisé'
    })
}

  function stopListening() {
    recognition.stop()
  }

  return {
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
  }
}