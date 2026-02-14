import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../../context/AppProvider';
import StorageService from '../../../services/StorageService';
import BackButton from '../../../components/BackButton';

const DeepListeningLab = () => {
  const navigate = useNavigate();
  const { addXp, t } = useApp();
  const [level, setLevel] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, listening, failed, success
  const [timeLeft, setTimeLeft] = useState(60);
  const [volume, setVolume] = useState(0);
  const [feedback, setFeedback] = useState(null); // For errors/messages

  const audioContextRef = useRef(null);
  const streamRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const utteranceRef = useRef(null);

  const levels = [
    { id: 1, text: "I am so exhausted from work today. My boss just keeps piling more and more on me, and I feel like I'm drowning. I just need a break but I can't take one." },
    { id: 2, text: "I can't believe you bought that new game console. We talked about saving for the house! It feels like you don't care about our future at all." },
    { id: 3, text: "You never listen to me! It's like talking to a wall. Sometimes I wonder if you even love me anymore. Maybe we should just take a break." }
  ];

  useEffect(() => {
    return () => {
      stopListening();
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  /* 
   * Status management:
   * We need `statusRef` to be the source of truth inside `requestAnimationFrame` loop.
   * We also need `status` state for UI rendering.
   */
  const statusRef = useRef('idle'); // idle, listening, failed, success
  
  const updateStatus = (newStatus) => {
      setStatus(newStatus);
      statusRef.current = newStatus;
  };

  useEffect(() => {
    return () => {
      stopListening();
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const startChallenge = async (selectedLevel) => {
    setLevel(selectedLevel);
    updateStatus('listening');
    setTimeLeft(60);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioContext;
      
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      
      speak(levels.find(l => l.id === selectedLevel).text);
      detectSoundLoop();
      
      // Timer logic
      const timer = setInterval(() => {
        // Check current status via ref to avoid stale closure issues
        if (statusRef.current !== 'listening') {
             clearInterval(timer);
             return;
        }

        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            finishSuccess();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

    } catch (err) {
      console.error("Microphone access denied", err);
      // alert("Microphone access required for this challenge."); // Removed alert
      setFeedback({ type: 'error', msg: t('module3.deep_listening.mic_error') || "Microphone access required." });
      updateStatus('idle');
    }
  };

  const speak = (text) => {
    if (synthRef.current) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8; 
      utteranceRef.current = utterance;
      synthRef.current.speak(utterance);
    }
  };

  const detectSoundLoop = () => {
      if (statusRef.current !== 'listening') return;

      const analyser = analyserRef.current;
      if (!analyser) return;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(dataArray);

      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
      }
      const average = sum / dataArray.length;
      setVolume(average);

      // Threshold check
      if (average > 35) { // Adjusted threshold slightly
        handleFail();
        return; // Stop loop
      }

      animationFrameRef.current = requestAnimationFrame(detectSoundLoop);
  };

  const handleFail = () => {
    if (statusRef.current !== 'listening') return;
    updateStatus('failed');
    stopListening();
    if (synthRef.current) synthRef.current.cancel();
  };

  const finishSuccess = () => {
     if (statusRef.current !== 'listening') return;
     updateStatus('success');
     stopListening();
     addXp(100);
  };

  const stopListening = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };


  const containerStyle = {
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto',
    textAlign: 'center',
    fontFamily: 'var(--font-sans, sans-serif)'
  };

  const levelButtonStyle = {
    display: 'block',
    width: '100%',
    padding: '20px',
    margin: '10px 0',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '18px',
    textAlign: 'left'
  };

  const activeCircleStyle = {
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    backgroundColor: status === 'failed' ? '#ffcdd2' : (status === 'success' ? '#c8e6c9' : '#e0f7fa'),
    margin: '40px auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    border: `5px solid ${status === 'failed' ? '#f44336' : (status === 'success' ? '#4caf50' : '#00acc1')}`,
    transition: 'all 0.3s'
  };

  return (
    <div className="page-container" style={{textAlign: 'center'}}>
      <header className="page-header">
         <BackButton />
         <h2>{t('module3.deep_listening.title')}</h2>
      </header>

      {status === 'idle' && (
        <div>
           <p>{t('module3.deep_listening.instruction')}</p>
           {levels.map(l => (
             <button 
                key={l.id} 
                style={levelButtonStyle}
                onClick={() => startChallenge(l.id)}
             >
               {t(`module3.deep_listening.level_${l.id}`, { defaultValue: l.text.substring(0, 20) + "..." })}
             </button>
           ))}
        </div>
      )}

      {status === 'listening' && (
        <div>
           <div style={activeCircleStyle}>
             <h3>{timeLeft}s</h3>
             <p>{t('module3.deep_listening.listening')}</p>
             <div style={{height: '10px', width: '80%', background: '#eee', marginTop: '10px', borderRadius: '5px'}}>
                <div style={{height: '100%', width: `${Math.min(100, volume * 2)}%`, background: volume > 30 ? 'red' : 'green', borderRadius: '5px', transition: 'width 0.1s'}} />
             </div>
           </div>
           <p style={{color: '#666'}}>Maintaing Noble Silence...</p>
        </div>
      )}

      {status === 'failed' && (
        <div>
           <div style={activeCircleStyle}>
             <h1 style={{fontSize: '50px'}}>🚫</h1>
           </div>
           <h3>{t('module3.deep_listening.fail_msg')}</h3>
           <button onClick={() => setStatus('idle')} style={{padding: '10px 20px', fontSize: '16px', borderRadius: '20px', border: 'none', background: '#333', color: 'white'}}>Try Again</button>
        </div>
      )}

      {status === 'success' && (
        <div>
           <div style={activeCircleStyle}>
             <h1 style={{fontSize: '50px'}}>✅</h1>
           </div>
           <h3>{t('module3.deep_listening.success_msg')}</h3>
           <button onClick={() => navigate('/')} style={{padding: '10px 20px', fontSize: '16px', borderRadius: '20px', border: 'none', background: '#333', color: 'white'}}>Done (+100 XP)</button>
        </div>
      )}

      {feedback && (
         <div style={{
            position: 'fixed', bottom: '30px', left: '50%', transform: 'translateX(-50%)',
            background: feedback.type === 'error' ? '#c62828' : '#333',
            color: 'white', padding: '10px 20px', borderRadius: '30px', fontWeight: 'bold'
         }}>
            {feedback.msg}
         </div>
      )}

    </div>
  );
};

export default DeepListeningLab;
