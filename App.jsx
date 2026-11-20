import { useState } from 'react';

const BACKEND_URL = 'https://comparafacile-backend.onrender.com';
const SUPABASE_URL = 'https://bqyyhpmxatvuxvlnwdwp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxeXlocG14YXZ0dXZ4bG5vd2RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUwOTU3NTgsImV4cCI6MjExMDY3MTc1OH0.pkBektrwI8yZE0f1SvW6RHMePqNGYLqkq5XAj_h1Qps';

function App() {
  const [tipoServizio, setTipoServizio] = useState('energia');
  const [tipoFornitura, setTipoFornitura] = useState('luce'); // 'luce', 'gas', 'dual'
  const [tipoCliente, setTipoCliente] = useState('privato');
  const [tipoPratica, setTipoPratica] = useState('Switch');
  
  const [nome, setNome] = useState('');
  const [cognome, setCognome] = useState('');
  const [ragioneSociale, setRagioneSociale] = useState('');
  const [partitaIva, setPartitaIva] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [codiceFiscale, setCodiceFiscale] = useState('');
  const [residenza, setResidenza] = useState('');
  const [pod, setPod] = useState('');
  const [pdr, setPdr] = useState('');
  const [fileBolletta, setFileBolletta] = useState(null);

  const [risultati, setRisultati] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successo, setSuccesso] = useState(false);
  const [errore, setErrore] = useState(null);

  const gestisciInvio = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrore(null);
    setRisultati(null);

    const datiUtente = {
      tipo_servizio: tipoServizio,
      tipo_fornitura: tipoServizio === 'energia' ? tipoFornitura : 'fibra',
      tipo_cliente: tipoCliente,
      tipo_pratica: tipoPratica,
      nome,
      cognome,
      ragione_sociale: ragioneSociale,
      partita_iva: partitaIva,
      email,
      telefono,
      codice_fiscale: codiceFiscale,
      residenza,
      pod,
      pdr
    };

    try {
      const risposta = await fetch(`${BACKEND_URL}/confronta`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datiUtente),
      });
      if (!risposta.ok) throw new Error("Errore dal server");
      const dati = await risposta.json();
      setRisultati(dati.risultati);
    } catch (error) {
      setErrore("Il server su Render si sta avviando (ci mette circa 30 secondi al primo avvio). Riprova tra poco.");
    } finally {
      setLoading(false);
    }
  };

  const inviaScelta = async (offerta) => {
    setLoading(true);
    setErrore(null);
    
    let fileUrl = "Nessun file caricato";

    // 1. CARICAMENTO FILE SU SUPABASE STORAGE (se presente)
    if (fileBolletta && SUPABASE_ANON_KEY.startsWith('eyJ')) {
      try {
        const cleanName = fileBolletta.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const fileName = `${Date.now()}_${cleanName}`;
        
        const uploadRes = await fetch(`${SUPABASE_URL}/storage/v1/object/bollette/${fileName}`, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': fileBolletta.type || 'application/octet-stream'
          },
          body: fileBolletta
        });
        
        if (uploadRes.ok) {
          fileUrl = `${SUPABASE_URL}/storage/v1/object/public/bollette/${fileName}`;
        } else {
          fileUrl = `File locale: ${fileBolletta.name}`;
        }
      } catch (err) {
        fileUrl = `File locale: ${fileBolletta.name}`;
      }
    }

    // 2. SALVATAGGIO TRAMITE IL TUO BACKEND SU RENDER (zero errori CORS!)
    const payload = {
      tipo_servizio: tipoServizio,
      tipo_fornitura: tipoServizio === 'energia' ? tipoFornitura : 'fibra',
      tipo_cliente: tipoCliente,
      tipo_pratica: tipoPratica,
      nome,
      cognome,
      ragione_sociale: ragioneSociale,
      partita_iva: partitaIva,
      email,
      telefono,
      codice_fiscale: codiceFiscale,
      residenza,
      pod,
      pdr,
      nome_file_bolletta: fileUrl,
      offerta_scelta: `${offerta.fornitore} - ${offerta.offerta} (${offerta.prezzo})`
    };

    try {
      const response = await fetch(`${BACKEND_URL}/salva`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setSuccesso(true);
        setRisultati(null);
      } else {
        const errData = await response.json();
        setErrore("Errore salvataggio: " + (errData.detail || "Controlla le colonne della tabella Supabase"));
      }
    } catch (error) {
      setErrore("Impossibile contattare il server di salvataggio. Riprova tra qualche secondo.");
    } finally {
      setLoading(false);
    }
  };

  const theme = { bg: '#09090b', cardBg: '#18181b', primary: '#f59e0b', secondary: '#3b82f6', textMain: '#fafafa', textMuted: '#a1a1aa', border: '#27272a' };

  const s = {
    body: { margin: 0, padding: 0, backgroundColor: theme.bg, minHeight: '100vh', width: '100%', fontFamily: 'Inter, system-ui, sans-serif', color: theme.textMain, display: 'flex', flexDirection: 'column', boxSizing: 'border-box' },
    nav: { padding: '20px 32px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: `1px solid ${theme.border}`, backgroundColor: theme.bg, width: '100%', boxSizing: 'border-box' },
    logoText: { fontSize: '22px', fontWeight: '800', letterSpacing: '-0.5px', color: theme.textMain, margin: 0 },
    mainContainer: { flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '40px 16px', width: '100%', boxSizing: 'border-box' },
    card: { width: '100%', maxWidth: '680px', backgroundColor: theme.cardBg, borderRadius: '24px', border: `1px solid ${theme.border}`, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', padding: '32px', boxSizing: 'border-box' },
    heroTitle: { fontSize: '30px', fontWeight: '800', textAlign: 'center', marginBottom: '10px', background: `linear-gradient(to right, ${theme.primary}, ${theme.secondary})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
    heroSub: { fontSize: '15px', color: theme.textMuted, textAlign: 'center', marginBottom: '32px' },
    sectionTitle: { fontSize: '12px', fontWeight: '700', color: theme.primary, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px', marginTop: '28px' },
    label: { display: 'block', fontSize: '13px', fontWeight: '500', color: theme.textMuted, marginBottom: '6px' },
    input: { width: '100%', padding: '12px 14px', borderRadius: '10px', border: `1px solid ${theme.border}`, backgroundColor: '#09090b', color: theme.textMain, fontSize: '15px', outline: 'none', boxSizing: 'border-box' },
    row: { display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' },
    col: { flex: '1 1 240px' },
    radioGroup: { display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '16px', backgroundColor: '#09090b', padding: '14px', borderRadius: '12px', border: `1px solid ${theme.border}` },
    radioLabel: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', cursor: 'pointer' },
    pillBtn: (active) => ({
      flex: 1,
      padding: '12px',
      borderRadius: '10px',
      border: active ? `1px solid ${theme.primary}` : `1px solid ${theme.border}`,
      backgroundColor: active ? 'rgba(245, 158, 11, 0.15)' : '#09090b',
      color: active ? theme.primary : theme.textMuted,
      fontWeight: active ? '700' : '500',
      cursor: 'pointer',
      textAlign: 'center',
      fontSize: '14px',
      transition: 'all 0.2s'
    }),
    btnPrimary: { width: '100%', padding: '16px', background: `linear-gradient(to right, ${theme.primary}, #d97706)`, color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', marginTop: '24px', boxShadow: `0 0 20px rgba(245, 158, 11, 0.25)` },
    offerCard: { border: `1px solid ${theme.border}`, borderRadius: '16px', padding: '18px', marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#09090b', gap: '12px', flexWrap: 'wrap' },
    offerBest: { border: `1px solid ${theme.primary}`, boxShadow: `0 0 15px rgba(245, 158, 11, 0.15)` },
    btnScegli: { backgroundColor: theme.secondary, color: 'white', border: 'none', padding: '10px 18px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' },
    successIcon: { width: '80px', height: '80px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto', fontSize: '40px' },
    error: { backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '14px', borderRadius: '10px', border: '1px solid rgba(239, 68, 68, 0.3)', marginBottom: '20px', fontSize: '14px' }
  };

  return (
    <div style={s.body}>
      <nav style={s.nav}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={theme.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill={theme.primary} />
        </svg>
        <h1 style={s.logoText}>AI <span style={{color: theme.primary}}>Energia</span></h1>
      </nav>

      <div style={s.mainContainer}>
        <div style={s.card}>
          {errore && <div style={s.error}>{errore}</div>}

          {successo ? (
            <div style={{ textAlign: 'center', padding: '30px 0' }}>
              <div style={s.successIcon}>🤖</div>
              <h2 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '16px' }}>Elaborazione Completata!</h2>
              <p style={{ color: theme.textMuted, fontSize: '15px', lineHeight: '1.6', marginBottom: '32px' }}>
                Grazie <strong style={{color: theme.textMain}}>{tipoCliente === 'azienda' ? ragioneSociale : nome}</strong>.<br/><br/>
                La nostra AI sta già svolgendo il suo lavoro. Invierà lei direttamente la richiesta alla fornitura scelta. 
                <strong style={{color: theme.primary}}> Verrai contattato entro 48 ore</strong> per finalizzare l'attivazione.
              </p>
              <button onClick={() => window.location.reload()} style={{...s.btnPrimary, background: theme.border, boxShadow: 'none'}}>Torna alla home</button>
            </div>
          ) : (
            <>
              <h2 style={s.heroTitle}>Chiedi all'AI di confrontare</h2>
              <p style={s.heroSub}>Scopri in 1 minuto quanto puoi risparmiare.</p>

              <form onSubmit={gestisciInvio}>
                <div style={s.sectionTitle}>1. Cosa vuoi confrontare?</div>
                <div style={s.radioGroup}>
                  <label style={s.radioLabel}>
                    <input type="radio" value="energia" checked={tipoServizio === 'energia'} onChange={() => setTipoServizio('energia')} />
                    ⚡ Energia
                  </label>
                  <label style={s.radioLabel}>
                    <input type="radio" value="telefonia" checked={tipoServizio === 'telefonia'} onChange={() => setTipoServizio('telefonia')} />
                    📱 Telefonia
                  </label>
                </div>

                {/* SELETTORE SOLO LUCE / SOLO GAS / DUAL */}
                {tipoServizio === 'energia' && (
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                    <div onClick={() => setTipoFornitura('luce')} style={s.pillBtn(tipoFornitura === 'luce')}>
                      💡 Solo Luce
                    </div>
                    <div onClick={() => setTipoFornitura('gas')} style={s.pillBtn(tipoFornitura === 'gas')}>
                      🔥 Solo Gas
                    </div>
                    <div onClick={() => setTipoFornitura('dual')} style={s.pillBtn(tipoFornitura === 'dual')}>
                      ⚡🔥 Dual (Luce + Gas)
                    </div>
                  </div>
                )}

                <div style={s.sectionTitle}>2. La tua richiesta</div>
                <div style={s.row}>
                  <div style={s.col}>
                    <label style={s.label}>Tipo di pratica</label>
                    <select style={s.input} value={tipoPratica} onChange={(e) => setTipoPratica(e.target.value)}>
                      <option value="Switch">Switch</option>
                      <option value="Nuova Attivazione">Nuova Attivazione</option>
                      <option value="Subentro">Subentro</option>
                      <option value="Voltura">Voltura</option>
                    </select>
                  </div>
                  <div style={s.col}>
                    <label style={s.label}>Sei un...</label>
                    <select style={s.input} value={tipoCliente} onChange={(e) => setTipoCliente(e.target.value)}>
                      <option value="privato">Privato</option>
                      <option value="azienda">Azienda</option>
                    </select>
                  </div>
                </div>

                <div style={s.sectionTitle}>3. I tuoi dati</div>
                <div style={s.row}>
                  {tipoCliente === 'azienda' ? (
                    <>
                      <div style={s.col}><label style={s.label}>Ragione Sociale</label><input type="text" style={s.input} value={ragioneSociale} onChange={(e) => setRagioneSociale(e.target.value)} required /></div>
                      <div style={s.col}><label style={s.label}>Partita IVA</label><input type="text" style={s.input} value={partitaIva} onChange={(e) => setPartitaIva(e.target.value)} required /></div>
                    </>
                  ) : (
                    <>
                      <div style={s.col}><label style={s.label}>Nome</label><input type="text" style={s.input} value={nome} onChange={(e) => setNome(e.target.value)} required /></div>
                      <div style={s.col}><label style={s.label}>Cognome</label><input type="text" style={s.input} value={cognome} onChange={(e) => setCognome(e.target.value)} required /></div>
                    </>
                  )}
                </div>

                <div style={s.row}>
                  <div style={s.col}><label style={s.label}>Email</label><input type="email" style={s.input} value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
                  <div style={s.col}><label style={s.label}>Cellulare</label><input type="tel" style={s.input} value={telefono} onChange={(e) => setTelefono(e.target.value)} required /></div>
                </div>

                <div style={s.row}>
                  {tipoCliente === 'privato' && (
                     <div style={s.col}><label style={s.label}>Codice Fiscale</label><input type="text" style={s.input} value={codiceFiscale} onChange={(e) => setCodiceFiscale(e.target.value)} required /></div>
                  )}
                  <div style={s.col}><label style={s.label}>Indirizzo</label><input type="text" style={s.input} value={residenza} onChange={(e) => setResidenza(e.target.value)} required /></div>
                </div>

                {/* MOSTRA POD SOLO SE LUCE O DUAL, PDR SOLO SE GAS O DUAL */}
                {tipoServizio === 'energia' && (
                  <div style={s.row}>
                    {(tipoFornitura === 'luce' || tipoFornitura === 'dual') && (
                      <div style={s.col}><label style={s.label}>Codice POD Luce (Opzionale)</label><input type="text" style={s.input} value={pod} onChange={(e) => setPod(e.target.value)} /></div>
                    )}
                    {(tipoFornitura === 'gas' || tipoFornitura === 'dual') && (
                      <div style={s.col}><label style={s.label}>Codice PDR Gas (Opzionale)</label><input type="text" style={s.input} value={pdr} onChange={(e) => setPdr(e.target.value)} /></div>
                    )}
                  </div>
                )}

                {tipoServizio === 'energia' && (
                  <div style={{marginTop: '10px'}}>
                    <label style={s.label}>Carica una bolletta (Opzionale)</label>
                    <input 
                      type="file" 
                      onChange={(e) => setFileBolletta(e.target.files[0])} 
                      style={{...s.input, padding: '10px'}} 
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                  </div>
                )}

                <button type="submit" disabled={loading} style={s.btnPrimary}>
                  {loading ? 'Analisi in corso...' : 'Confronta Offerte'}
                </button>
              </form>

              {risultati && (
                <div style={{ marginTop: '36px' }}>
                  <h3 style={{ fontSize: '18px', color: theme.textMain, marginBottom: '16px' }}>
                    Le migliori offerte {tipoServizio === 'energia' ? `(${tipoFornitura.toUpperCase()})` : 'Telefonia'}
                  </h3>
                  {risultati.map((offerta, indice) => (
                    <div key={indice} style={indice === 0 ? {...s.offerCard, ...s.offerBest} : s.offerCard}>
                      <div>
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '17px', color: theme.textMain }}>{offerta.fornitore}</h4>
                        <p style={{ margin: 0, fontSize: '13px', color: theme.textMuted }}>{offerta.offerta}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ fontSize: '16px', fontWeight: '800', color: theme.primary }}>{offerta.prezzo}</div>
                        <button onClick={() => inviaScelta(offerta)} disabled={loading} style={s.btnScegli}>
                          {loading ? '...' : 'Scegli'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
