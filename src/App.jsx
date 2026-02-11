import React, { useState, useEffect } from 'react'
import DotGrid from './DotGrid'

const questions = [
  {
    text: "Aimes-tu le chocolat ?",
    buttons: [
      { label: "Oui", color: "#27a745" },
      { label: "Non", color: "#d02828" }
    ]
  },
  {
    text: "Quand est-ce que tu es libre ?",
    buttons: [
      { label: "14/02 à 17h", color: "#ff4ac3" },
      { label: "14/02 à 19h", color: "#ff4ac3" },
      { label: "toute la journée rien que pour toi bb", color: "#ff4ac3" }
    ]
  },
  {
    text: "Tu préfères ?",
    buttons: [
      { label: "Chocolat au lait", color: "#ff4ac3" },
      { label: "Chocolat Noir", color: "#ff4ac3" }
    ]
  }
]

// Fonction pour générer le texte final personnalisé
const buildFinalText = (answers) => {
  if (answers.length < 3) return ""
  return `Tu veux être ma valentine !!!\nTrop bien, merci 🙏 On a un date: ${answers[1]} !\nOn se retrouve très bientôt, pour l'instant je te laisse avec un petit bouquet de fleur <3`
}

const App = () => {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)
  const [answers, setAnswers] = useState([])
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 })

  const [finished, setFinished] = useState(false)
  const [fadeToBlack, setFadeToBlack] = useState(false)
  const [blackVisible, setBlackVisible] = useState(false)
  const [showVideo, setShowVideo] = useState(false)

  // Typewriter final
  const [finalText, setFinalText] = useState('')
  const [displayedFinal, setDisplayedFinal] = useState('')
  const [finalCharIndex, setFinalCharIndex] = useState(0)
  const [showFinalText, setShowFinalText] = useState(false)

  const handleAnswer = (answer) => {
    // Bouton "Non" qui fuit à la question 1
    if (index === 0 && answer === 'Non') {
      setNoPosition({
        x: Math.random() * 200 - 100,
        y: Math.random() * 120 - 60,
      })
      return
    }

    setAnswers(prev => [...prev, answer])
    setVisible(false)

    setTimeout(() => {
      if (index + 1 >= questions.length) {
        setFinished(true)
        setShowFinalText(true) // déclenche le typewriter
      } else {
        setIndex(prev => prev + 1)
        setVisible(true)
      }
    }, 300)
  }

  const progress = (index / questions.length) * 100

  // Typewriter pour le texte final
  useEffect(() => {
    if (!showFinalText) return
    if (finalCharIndex === 0) {
      // construire le texte final uniquement au début
      setFinalText(buildFinalText(answers))
    }
    if (finalCharIndex >= finalText.length) return

    const t = setTimeout(() => {
      setDisplayedFinal(prev => prev + finalText[finalCharIndex])
      setFinalCharIndex(prev => prev + 1)
    }, 35)

    return () => clearTimeout(t)
  }, [showFinalText, finalCharIndex, finalText, answers])

  // Déclenche le fade noir après que le texte final soit entièrement écrit
  useEffect(() => {
    if (finalCharIndex === finalText.length && finalText.length > 0) {
      setTimeout(() => {
        setFadeToBlack(true)
        setTimeout(() => setBlackVisible(true), 1000)
        setTimeout(() => setShowVideo(true), 4000) // démarre la vidéo après fade
      }, 2000) // pause 2s pour lire le texte final
    }
  }, [finalCharIndex, finalText])

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      {/* Background */}
      <div style={{ width: '100vw', height: '100vh', position: 'fixed', zIndex: -1 }}>
        <DotGrid
          dotSize={3}
          gap={15}
          baseColor="#bcbcbc"
          activeColor="#f2005d"
          proximity={80}
          shockRadius={190}
          shockStrength={2}
          resistance={750}
          returnDuration={1.5}
        />
      </div>

      {/* Progress bar */}
      {!finished && (
        <div style={{
          position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)',
          width: '80%', maxWidth: 600, zIndex: 2
        }}>
          <div style={{
            height: 12,
            background: 'rgba(255,255,255,0.15)',
            borderRadius: 6,
            overflow: 'hidden',
            backdropFilter: 'blur(6px)'
          }}>
            <div style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(125deg, #b7a5f5, #ff4ac3)',
              animation: 'breatheXY 4s ease-in-out infinite',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>
      )}

      {/* Questions */}
      {!finished && (
        <div style={{
          position: 'fixed', inset: 0,
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center', gap: 30, textAlign: 'center'
        }}>
          <div style={{ opacity: visible ? 1 : 0, transition: 'opacity .3s ease' }}>
            <h1 style={{ fontSize: '40px', color: 'black' }}>{questions[index].text}</h1>
            <div style={{ display: 'flex', gap: 20, justifyContent: 'center', position: 'relative' }}>
              {questions[index].buttons.map((btn, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(btn.label)}
                  style={{
                    padding: '14px 24px',
                    background: btn.color,
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    cursor: 'pointer',
                    position: index === 0 && btn.label === 'Non' ? 'relative' : 'static',
                    transform: index === 0 && btn.label === 'Non'
                      ? `translate(${noPosition.x}px, ${noPosition.y}px)` : 'none',
                    transition: 'transform .25s ease'
                  }}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Résumé final */}
      {showFinalText && (
        <div style={{
          position: 'fixed', inset: 0,
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'black', gap: 14, textAlign: 'center', zIndex: 5
        }}>
          <p style={{ whiteSpace: 'pre-wrap', fontSize: '24px' }}>{displayedFinal}|</p>
        </div>
      )}

      {/* Fade noir */}
      {fadeToBlack && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'black', zIndex: 8,
          opacity: blackVisible ? 1 : 0,
          transition: 'opacity 2.5s ease-in-out'
        }} />
      )}

      {/* Vidéo */}
      {showVideo && (
        <video
          src="/fleurascii.mov"
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: 'fixed', inset: 0,
            top: '50%', left: '50',
            transform: 'translate(50%, -50%)',
            width: '50vw', height: '50vh',
            objectFit: 'contain', zIndex: 9
          }}
        />
      )}

      <style>{`
        @keyframes breatheXY {
          0% { transform: scale(1); }
          50% { transform: scale(1.03); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  )
}

export default App
