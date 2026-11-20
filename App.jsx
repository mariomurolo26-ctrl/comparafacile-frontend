import { useState } from 'react';

function App() {
  const [tipoServizio, setTipoServizio] = useState('energia');
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
      tipo_cliente: tipoCliente,
      tipo_pratica: tipoPratica,
      nome, cognome, ragione_sociale: ragioneSociale, partita_iva: partitaIva,
      email, telefono, codice_fiscale: codiceFiscale, residenza
    };

    try {
      const risposta = await fetch('https://comparafacile-backend.onrender.com/confronta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datiUtente),
      });
      const dati = await risposta.json();
      setRisultati(dati.risultati);
    } catch (error) {
      setErrore("Il server ci sta mettendo troppo tempo a svegliarsi. Riprova tra 30 secondi.");
    } finally {
      setLoading(false);
    }
  };

  const inviaScelta = async (offerta) => {
    setLoading(true);
    setErrore(null);
    
    const payload = {
      tipo_servizio: tipoServizio, tipo_cliente: tipoCliente, tipo_pratica: tipoPratica,
      nome, cognome, ragione_sociale: ragioneSociale, partita_iva: partitaIva,
      email, telefono, codice_fiscale: codiceFiscale, residenza,
      nome_file_bolletta: fileBolletta ? fileBolletta.name : "Nessun file caricato",
      offerta_scelta: `${offerta.fornitore} - ${offerta.offerta}`
    };

    try {
      const response = await fetch('https://bqyyhpmxatvuxvlnwdwp.supabase.co/rest/v1/lead_ai_energia', {
        method: 'POST',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxeXlocG14YXZ0dXZ4bG5vd2RwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5NTA5NTc1OCwiZXhwIjoyMTEwNjcxNzU4fQ.Jgdn4QNHBJEwCD-A1jInJtOG5D-8OxRJRzbjKPI7o6E',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxeXlocG14YXZ0dXZ4bG5vd2RwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5NTA5NTc1OCwiZXhwIjoyMTEwNjcxNzU4fQ.Jgdn4QNHBJEwCD-A1jInJtOG5D-8OxRJRzbjKPI7o6E',
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setSuccesso(true);
        setRisultati(null);
      } else {
        const erroreDettaglio = await response.text();
        alert("ERRORE SUPABASE: " + erroreDettaglio); // Questo ti dirà esattamente cosa non va
        setErrore("Errore salvataggio: " + erroreDettaglio);
      }
    } catch (error) {
      setErrore("Errore di connessione al database.");
    } finally {
      setLoading(false);
    }
  };

  const theme = {
    bg: '#09090b',
    cardBg: '#18181b',
    primary: '#f59e0b',
    secondary: '#3b82f6',
    textMain: '#fafafa',
    textMuted: '#a1a1aa',
    border: '#27272a'
  };

  const s = {
    // Aggiunto margin: 0 e padding: 0 per togliere i bordi bianchi
    body: { margin: 0, padding: 0, backgroundColor: theme.bg, minHeight: '100vh', width: '100vw', fontFamily: 'Inter, system-ui, sans-serif', color: theme.textMain, display: 'flex', flexDirection: 'column', overflowX: 'hidden' },
    nav: { padding: '20px 40px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: `1px solid ${theme.border}`, backgroundColor: theme.bg },
    logoText: { fontSize: '22px', fontWeight: '800', letterSpacing: '-0.5px', color: theme.textMain, margin: 0 },
    mainContainer: { flex: 1, display: 'flex', justifyContent: 'center', padding: '40px 20px' },
    card: { width: '100%', maxWidth: '700px', backgroundColor: theme.cardBg, borderRadius: '24px', border: `1px solid ${theme.border}`, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', padding: '40px' },
    heroTitle: { fontSize: '32px', fontWeight: '800', textAlign: 'center', marginBottom: '10px', background: `linear-gradient(to right, ${theme.primary}, ${theme.secondary})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
    heroSub: { fontSize: '16px', color: theme.textMuted, textAlign: 'center', marginBottom: '40px' },
    sectionTitle: { fontSize: '13px', fontWeight: '700', color: theme.primary, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', marginTop: '30px' },
    label: { display: 'block', fontSize: '14px', fontWeight: '500', color: theme.textMuted, marginBottom: '8px' },
    input: { width: '100%', padding: '14px 16px', borderRadius: '12px', border: `1px solid ${theme.border}`, backgroundColor: '#09090b', color: theme.textMain, fontSize: '15px', outline: 'none' },
    row: { display: 'flex', gap: '16px' },
    col: { flex: 1, marginBottom: '16px' },
    radioGroup: { display: 'flex', gap: '20px', marginBottom: '20px', backgroundColor: '#09090b', padding: '15px', borderRadius: '12px', border: `1px solid ${theme.border}` },
    radioLabel: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', cursor: 'pointer' },
    btnPrimary: { width: '100%', padding: '18px', background: `linear-gradient(to right, ${theme.primary}, #d97706)`, color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', marginTop: '20px', boxShadow: `0 0 20px rgba(245, 158, 11, 0.3)` },
    offerCard: { border: `1px solid ${theme.border}`, borderRadius: '16px', padding: '20px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#09090b' },
    offerBest: { border: `1px solid ${theme.primary}`, boxShadow: `0 0 15px rgba(245, 158, 11, 0.2)` },
    btnScegli: { backgroundColor: theme.secondary, color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' },
    successIcon: { width: '80px', height: '80px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto', fontSize: '40px' },
    error: { backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '16px', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)', marginBottom: '20px' }
  };

  return (
    <div style={s.body}>
      <nav style={s.nav}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={theme.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill={theme.primary} />
        </svg>
        <h1 style={s.logoText}>AI <span style={{color: theme.primary}}>Energia</span></h1>
      </nav>

      <div style={s.mainContainer}>
        <div style={s.card}>
          {errore && <div style={s.error}>{errore}</div>}

          {successo ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={s.successIcon}>🤖</div>
              <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '16px' }}>Elaborazione Completata!</h2>
              <p style={{ color: theme.textMuted, fontSize: '16px', lineHeight: '1.6', marginBottom: '32px' }}>
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

                {/* CARICAMENTO FATTURA OPZIONALE */}
                {tipoServizio === 'energia' && (
                  <div style={{...s.col, marginTop: '10px'}}>
                    <label style={s.label}>Carica una bolletta (Opzionale)</label>
                    <input 
                      type="file" 
                      onChange={(e) => setFileBolletta(e.target.files[0])} 
                      style={{...s.input, padding: '10px'}} 
                      accept=".pdf,.jpg,.png"
                    />
                  </div>
                )}

                <button type="submit" disabled={loading} style={s.btnPrimary}>
                  {loading ? 'Analisi in corso...' : 'Confronta Offerte'}
                </button>
              </form>

              {risultati && (
                <div style={{ marginTop: '40px' }}>
                  <h3 style={{ fontSize: '18px', color: theme.textMain, marginBottom: '20px' }}>Le migliori offerte trovate</h3>
                  {risultati.map((offerta, indice) => (
                    <div key={indice} style={indice === 0 ? {...s.offerCard, ...s.offerBest} : s.offerCard}>
                      <div>
                        <h4 style={{ margin: '0 0 5px 0', fontSize: '18px', color: theme.textMain }}>{offerta.fornitore}</h4>
                        <p style={{ margin: 0, fontSize: '14px', color: theme.textMuted }}>{offerta.offerta}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ fontSize: '18px', fontWeight: '800', color: theme.primary }}>{offerta.prezzo}</div>
                        <button onClick={() => inviaScelta(offerta)} style={s.btnScegli}>Scegli</button>
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
