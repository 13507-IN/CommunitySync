"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Sparkles, Check, AlertCircle, RefreshCw, Volume2 } from "lucide-react";

interface VoiceReportingCardProps {
  onTranscriptComplete: (data: {
    description: string;
    category: "infrastructure" | "health" | "environment" | "safety" | "education" | "social" | "other";
    urgency: "low" | "medium" | "high";
    title: string;
  }) => void;
}

export function VoiceReportingCard({ onTranscriptComplete }: VoiceReportingCardProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(true);
  const [parsedData, setParsedData] = useState<{
    category: "infrastructure" | "health" | "environment" | "safety" | "education" | "social" | "other";
    urgency: "low" | "medium" | "high";
    title: string;
  } | null>(null);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      typeof window !== "undefined" &&
      ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-IN"; // English (India) / global English

    recognition.onresult = (event: any) => {
      let currentInterim = "";
      let finalSpeech = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalSpeech += event.results[i][0].transcript + " ";
        } else {
          currentInterim += event.results[i][0].transcript;
        }
      }

      setInterimTranscript(currentInterim);
      if (finalSpeech) {
        setTranscript((prev) => {
          const updated = (prev + " " + finalSpeech).trim();
          // Real-time intent parse
          const parsed = parseCivicIntent(updated);
          setParsedData(parsed);
          return updated;
        });
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  function parseCivicIntent(text: string) {
    const lower = text.toLowerCase();

    // Category heuristics
    let category: "infrastructure" | "health" | "environment" | "safety" | "education" | "social" | "other" = "infrastructure";

    if (lower.match(/garbage|trash|dump|waste|pollution|plastic|smoke|tree|river|lake|drainage|sewage|dirt|smell/)) {
      category = "environment";
    } else if (lower.match(/hospital|clinic|dengue|malaria|illness|disease|doctor|medicine|contaminated|stench|vomit|infection|water quality/)) {
      category = "health";
    } else if (lower.match(/accident|theft|robbery|fire|danger|hazard|crime|fight|harass|dark alley|security|police|dark/)) {
      category = "safety";
    } else if (lower.match(/school|college|education|teacher|student|classroom|books/)) {
      category = "education";
    } else if (lower.match(/pothole|road|asphalt|pavement|pipe|water supply|leak|wire|electric|pole|streetlight|street light|light|bridge|traffic/)) {
      category = "infrastructure";
    }

    // Urgency heuristics
    let urgency: "low" | "medium" | "high" = "medium";
    if (lower.match(/urgent|immediately|danger|dangerous|critical|emergency|severe|huge|heavy|dying|death|injury|injured|fire|flooding|quick/)) {
      urgency = "high";
    } else if (lower.match(/minor|small|slight|not urgent|whenever|low/)) {
      urgency = "low";
    }

    // Title generation
    const clean = text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").trim();
    const words = clean.split(/\s+/).slice(0, 6).join(" ");
    const title = words ? words.toUpperCase() : "CIVIC VOICE REPORT";

    return { category, urgency, title };
  }

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript("");
      setInterimTranscript("");
      setParsedData(null);
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleApplyVoiceReport = () => {
    const fullText = (transcript + " " + interimTranscript).trim();
    if (!fullText) return;

    const parsed = parsedData || parseCivicIntent(fullText);
    onTranscriptComplete({
      description: fullText,
      category: parsed.category,
      urgency: parsed.urgency,
      title: parsed.title,
    });
  };

  if (!isSupported) {
    return (
      <div className="p-4 border-2 border-swiss-fg/20 bg-swiss-muted text-[10px] font-bold text-swiss-fg/60 uppercase">
        💡 Voice Mode is active in Chrome, Edge, Safari, and modern mobile browsers. Type below if using an unsupported client.
      </div>
    );
  }

  return (
    <div className="border-4 border-swiss-fg bg-swiss-bg p-6 md:p-8 relative overflow-hidden font-swiss shadow-[8px_8px_0_0_rgba(255,48,0,0.15)]">
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-48 h-48 swiss-dots opacity-10 pointer-events-none" />

      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 border-2 border-swiss-fg flex items-center justify-center transition-colors ${
            isListening ? "bg-swiss-red text-white" : "bg-swiss-fg text-swiss-bg"
          }`}>
            <Mic className={`w-5 h-5 ${isListening ? "animate-bounce" : ""}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-swiss-red">
                AI VOICE REPORTING MODE
              </span>
              <span className="px-1.5 py-0.5 bg-swiss-fg text-swiss-bg text-[7px] font-black tracking-widest uppercase">
                HANDS-FREE
              </span>
            </div>
            <p className="text-sm font-black uppercase text-swiss-fg tracking-tight">
              SPEAK YOUR ISSUE NATURALLY
            </p>
          </div>
        </div>

        {/* Listen Button */}
        <button
          type="button"
          onClick={toggleListening}
          className={`px-6 py-3 font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 border-2 border-swiss-fg cursor-pointer shadow-[4px_4px_0_0_rgba(0,0,0,1)] ${
            isListening 
              ? "bg-swiss-red text-white animate-pulse" 
              : "bg-swiss-fg text-swiss-bg hover:bg-swiss-red"
          }`}
        >
          {isListening ? (
            <>
              <MicOff className="w-4 h-4" />
              STOP RECORDING
            </>
          ) : (
            <>
              <Mic className="w-4 h-4" />
              START SPEAKING
            </>
          )}
        </button>
      </div>

      {/* Audio Visualizer Waves (when listening) */}
      {isListening && (
        <div className="mb-6 p-4 bg-swiss-fg text-swiss-bg border-2 border-swiss-fg flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 h-6">
            {[40, 80, 50, 95, 65, 90, 45, 100, 70, 85, 55, 90].map((h, i) => (
              <span
                key={i}
                className="w-1 bg-swiss-red transition-all duration-150 animate-pulse"
                style={{
                  height: `${h}%`,
                  animationDelay: `${i * 80}ms`,
                }}
              />
            ))}
          </div>
          <span className="text-[9px] font-black tracking-widest uppercase text-swiss-bg/80 animate-pulse">
            LISTENING... EXPLAIN WHAT IS WRONG AND WHERE
          </span>
        </div>
      )}

      {/* Live Transcript Display Box */}
      <div className="p-4 border-2 border-swiss-fg bg-swiss-muted min-h-[90px] flex flex-col justify-between">
        <p className="text-[8px] font-black uppercase tracking-widest text-swiss-fg/40 mb-1">
          LIVE AUDIO TRANSCRIPT
        </p>
        <p className="text-xs md:text-sm font-bold text-swiss-fg italic leading-relaxed">
          {transcript || interimTranscript ? (
            <>
              <span>{transcript}</span>
              <span className="text-swiss-red">{interimTranscript}</span>
            </>
          ) : (
            <span className="text-swiss-fg/30 not-italic">
              Click "Start Speaking" and say: "Broken streetlight and open manhole near market causing danger at night"
            </span>
          )}
        </p>

        {/* AI Intent Extraction Chips */}
        {parsedData && (
          <div className="mt-3 pt-3 border-t border-swiss-fg/10 flex flex-wrap items-center gap-2">
            <span className="text-[8px] font-black uppercase tracking-widest text-swiss-red flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              AI EXTRACTED:
            </span>
            <span className="px-2 py-0.5 bg-swiss-fg text-swiss-bg text-[8px] font-black uppercase tracking-widest">
              CATEGORY: {parsedData.category.toUpperCase()}
            </span>
            <span className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-widest border border-swiss-fg ${
              parsedData.urgency === 'high' ? 'bg-swiss-red text-white' : 'bg-white'
            }`}>
              URGENCY: {parsedData.urgency.toUpperCase()}
            </span>
            <span className="text-[8px] font-bold text-swiss-fg/60 uppercase truncate max-w-[200px]">
              TITLE: {parsedData.title}
            </span>
          </div>
        )}
      </div>

      {/* Apply Button */}
      {(transcript || interimTranscript) && (
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in">
          <p className="text-[9px] font-bold text-swiss-fg/60 uppercase">
            Click apply to auto-fill the form with your voice transcription and AI-detected tags.
          </p>

          <button
            type="button"
            onClick={handleApplyVoiceReport}
            className="w-full sm:w-auto px-6 py-2.5 bg-swiss-red text-white font-black text-xs uppercase tracking-widest hover:bg-swiss-fg transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            APPLY VOICE REPORT TO FORM
          </button>
        </div>
      )}
    </div>
  );
}
