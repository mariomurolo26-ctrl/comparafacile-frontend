import { useState } from 'react';

function App() {
  const [tipoFornitura, setTipoFornitura] = useState('duale');
  const [nome, setNome] = useState('');
  const [cognome, setCognome] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [codiceFiscale, setCodiceFiscale] = useState('');
  
  // Nuovi campi
  const [residenza, setResidenza] = useState('');
  const [luogoFornitura, setLuogoFornitura] = useState('');
  const [isStessaResidenza, setIsStessaResidenza] = useState(true);
  const [pod, setPod] = useState('');
  const [pdr, setPdr] = useState('');

  const [risultati, setRisultati] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successo, setSuccesso] = useState(false);
  const [errore, setErrore] = useState(null);

  const gestisciInvio = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrore(null);
    setRisultati(null);

    const indirizzoFornitura = isStessaResidenza ? residenza : luogoFornitura;

    const datiUtente = {
      tipo_fornitura: tipoFornitura,
      nome, cognome, email, telefono, codice_fiscale: codiceFiscale,
      residenza: residenza,
      luogo_fornitura: indirizzoFornitura,
      pod: pod,
      pdr: pdr
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
      setErrore("Errore di connessione. Assicurati che il server Python sia acceso.");
    } finally {
      setLoading(false);
    }
  };

  const inviaScelta = async (offerta) => {
    setLoading(true);
    const indirizzoFornitura = isStessaResidenza ? residenza : luogoFornitura;

    const datiCompleti = {
      dati_utente: {
        tipo_fornitura: tipoFornitura,
        nome, cognome, email, telefono, codice_fiscale: codiceFiscale,
        residenza: residenza,
        luogo_fornitura: indirizzoFornitura,
        pod: pod,
        pdr: pdr
      },
      offerta_scelta: `${offerta.fornitore} - ${offerta.offerta}`
    };

    try {
      await fetch('https://comparafacile-backend.onrender.com/scegli', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datiCompleti),
      });
      setSuccesso(true);
      setRisultati(null);
    } catch (error) {
      setErrore("Errore nell'invio. Riprova.");
    } finally {
      setLoading(false);
    }
  };

  // STILI MINIMAL
  const theme = {
    bg: '#f3f4f6',
    cardBg: '#ffffff',
    primary: '#4f46e5',
    textMain: '#111827',
    textMuted: '#6b7280',
    border: '#e5e7eb'
  };

  const s = {
    body: { backgroundColor: theme.bg, minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif', display: 'flex', flexDirection: 'column' },
    nav: { backgroundColor: theme.cardBg, padding: '20px 0', borderBottom: `1px solid ${theme.border}`, textAlign: 'center' },
    logoText: { fontSize: '24px', fontWeight: '800', letterSpacing: '-0.5px', color: theme.textMain, margin: 0 },
    logoDot: { color: theme.primary },
    mainContainer: { flex: 1, display: 'flex', justifyContent: 'center', padding: '40px 20px' },
    card: { width: '100%', maxWidth: '700px', backgroundColor: theme.cardBg, borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)', padding: '40px', boxSizing: 'border-box' },
    title: { fontSize: '24px', fontWeight: '700', color: theme.textMain, marginTop: 0, marginBottom: '8px' },
    subtitle: { fontSize: '15px', color: theme.textMuted, marginTop: 0, marginBottom: '32px' },
    sectionTitle: { fontSize: '14px', fontWeight: '600', color: theme.textMain, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px', marginTop: '28px', borderBottom: `1px solid ${theme.border}`, paddingBottom: '8px' },
    inputGroup: { marginBottom: '16px' },
    label: { display: 'block', fontSize: '14px', fontWeight: '500', color: theme.textMain, marginBottom: '6px' },
    input: { width: '100%', padding: '12px 14px', borderRadius: '8px', border: `1px solid ${theme.border}`, fontSize: '15px', color: theme.textMain, boxSizing: 'border-box', backgroundColor: '#f9fafb' },
    row: { display: 'flex', gap: '16px' },
    col: { flex: 1 },
    checkboxGroup: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', cursor: 'pointer' },
    btnPrimary: { width: '100%', padding: '16px', backgroundColor: theme.primary, color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', marginTop: '24px' },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '16px' },
    th: { padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: theme.textMuted, borderBottom: `1px solid ${theme.border}`, textTransform: 'uppercase' },
    td: { padding: '16px 12px', fontSize: '15px', color: theme.textMain, borderBottom: `1px solid ${theme.border}` },
    btnScegli: { backgroundColor: theme.textMain, color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' },
    successBox: { textAlign: 'center', padding: '40px 20px' },
    successIcon: { width: '64px', height: '64px', backgroundColor: '#ecfdf5', color: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto' },
    error: { backgroundColor: '#fef2f2', color: '#b91c1c', padding: '12px', borderRadius: '8px', fontSize: '14px', marginBottom: '20px', border: '1px solid #fecaca' }
  };

  return (
    <div style={s.body}>
      {/* NAVBAR CON NUOVO NOME */}
      <nav style={s.nav}>
        <h1 style={s.logoText}>Compara<span style={s.logoDot}>Facile</span></h1>
      </nav>

      <div style={s.mainContainer}>
        <div style={s.card}>
          {errore && <div style={s.error}>{errore}</div>}

          {successo ? (
            <div style={s.successBox}>
              <div style={s.successIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <h2 style={{...s.title, marginBottom: '12px'}}>Richiesta Ricevuta!</h2>
              <p style={{ color: theme.textMuted, fontSize: '16px', lineHeight: '1.5', marginBottom: '32px' }}>
                Grazie <strong>{nome}</strong>, abbiamo registrato la tua preferenza.<br/>
                Un nostro consulente ti contatterà <strong>entro 48 ore</strong> ai recapiti forniti.
              </p>
              <button onClick={() => window.location.reload()} style={{...s.btnPrimary, backgroundColor: theme.border, color: theme.textMain}}>Torna alla home</button>
            </div>
          ) : (
            <>
              <h2 style={s.title}>Confronta le offerte</h2>
              <p style={s.subtitle}>Scopri in 1 minuto come risparmiare sulle tue bollette.</p>

              <form onSubmit={gestisciInvio}>
                <div style={s.sectionTitle}>1. Dati Personali</div>
                <div style={s.row}>
                  <div style={{...s.inputGroup, ...s.col}}>
                    <label style={s.label}>Nome</label>
                    <input type="text" style={s.input} value={nome} onChange={(e) => setNome(e.target.value)} required />
                  </div>
                  <div style={{...s.inputGroup, ...s.col}}>
                    <label style={s.label}>Cognome</label>
                    <input type="text" style={s.input} value={cognome} onChange={(e) => setCognome(e.target.value)} required />
                  </div>
                </div>

                <div style={s.row}>
                  <div style={{...s.inputGroup, ...s.col}}>
                    <label style={s.label}>Email</label>
                    <input type="email" style={s.input} value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <div style={{...s.inputGroup, ...s.col}}>
                    <label style={s.label}>Cellulare</label>
                    <input type="tel" style={s.input} value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
                  </div>
                </div>

                <div style={s.row}>
                  <div style={{...s.inputGroup, ...s.col}}>
                    <label style={s.label}>Codice Fiscale</label>
                    <input type="text" style={s.input} value={codiceFiscale} onChange={(e) => setCodiceFiscale(e.target.value)} required />
                  </div>
                  <div style={{...s.inputGroup, ...s.col}}>
                    <label style={s.label}>Indirizzo di Residenza</label>
                    <input type="text" style={s.input} value={residenza} onChange={(e) => setResidenza(e.target.value)} placeholder="Via, Civico, Città" required />
                  </div>
                </div>

                <div style={s.sectionTitle}>2. Dettagli Fornitura</div>
                <div style={s.inputGroup}>
                  <label style={s.label}>Cosa vuoi confrontare?</label>
                  <select style={s.input} value={tipoFornitura} onChange={(e) => setTipoFornitura(e.target.value)}>
                    <option value="luce">Solo Luce</option>
                    <option value="gas">Solo Gas</option>
                    <option value="duale">Luce + Gas (Dual Fuel)</option>
                    <option value="fibra">Fibra Internet</option>
                  </select>
                </div>

                {/* INDIRIZZO DI FORNITURA (Solo se non è fibra) */}
                {tipoFornitura !== 'fibra' && (
                  <>
                    <div style={s.checkboxGroup} onClick={() => setIsStessaResidenza(!isStessaResidenza)}>
                      <input type="checkbox" checked={isStessaResidenza} onChange={() => {}} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                      <label style={{...s.label, marginBottom: 0, cursor: 'pointer' }}>Il luogo di fornitura è la mia residenza</label>
                    </div>

                    {!isStessaResidenza && (
                      <div style={s.inputGroup}>
                        <label style={s.label}>Indirizzo Luogo di Fornitura</label>
                        <input type="text" style={s.input} value={luogoFornitura} onChange={(e) => setLuogoFornitura(e.target.value)} placeholder="Via, Civico, Città" required />
                      </div>
                    )}
                  </>
                )}

                {/* POD E PDR (Facoltativi) */}
                {tipoFornitura !== 'fibra' && (
                  <div style={s.row}>
                    {(tipoFornitura === 'luce' || tipoFornitura === 'duale') && (
                      <div style={{...s.inputGroup, ...s.col}}>
                        <label style={s.label}>Codice POD (opzionale)</label>
                        <input type="text" style={s.input} value={pod} onChange={(e) => setPod(e.target.value)} placeholder="IT001E..." />
                      </div>
                    )}
                    {(tipoFornitura === 'gas' || tipoFornitura === 'duale') && (
                      <div style={{...s.inputGroup, ...s.col}}>
                        <label style={s.label}>Codice PDR (opzionale)</label>
                        <input type="text" style={s.input} value={pdr} onChange={(e) => setPdr(e.target.value)} placeholder="01234567890..." />
                      </div>
                    )}
                  </div>
                )}

                <button type="submit" disabled={loading} style={s.btnPrimary}>
                  {loading ? 'Ricerca in corso...' : 'Confronta Offerte Gratis'}
                </button>
              </form>

              {/* RISULTATI */}
              {risultati && (
                <div style={{ marginTop: '40px' }}>
                  <h3 style={{ fontSize: '18px', color: theme.textMain, marginBottom: '8px' }}>Offerte disponibili</h3>
                  <table style={s.table}>
                    <thead>
                      <tr>
                        <th style={s.th}>Fornitore</th>
                        <th style={s.th}>Offerta</th>
                        <th style={s.th}>{tipoFornitura === 'fibra' ? 'Costo' : 'Luce'}</th>
                        {tipoFornitura !== 'fibra' && <th style={s.th}>Gas</th>}
                        <th style={s.th}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {risultati.map((offerta, indice) => (
                        <tr key={indice}>
                          <td style={s.td}><strong>{offerta.fornitore}</strong></td>
                          <td style={s.td}>{offerta.offerta}</td>
                          <td style={s.td}>{offerta.prezzo1}</td>
                          {tipoFornitura !== 'fibra' && <td style={s.td}>{offerta.prezzo2}</td>}
                          <td style={s.td}>
                            <button onClick={() => inviaScelta(offerta)} style={s.btnScegli}>Scegli</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
