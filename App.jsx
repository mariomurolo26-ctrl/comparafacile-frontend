import { useState } from 'react';

function App() {
  // Nuovi stati per la pratica e il tipo cliente
  const [tipoPratica, setTipoPratica] = useState('switch');
  const [tipoCliente, setTipoCliente] = useState('privato');
  const [tipoFornitura, setTipoFornitura] = useState('duale');
  
  const [nome, setNome] = useState('');
  const [cognome, setCognome] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [codiceFiscale, setCodiceFiscale] = useState('');
  const [ragioneSociale, setRagioneSociale] = useState('');
  const [partitaIva, setPartitaIva] = useState('');

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

    const datiUtente = {
      tipo_pratica: tipoPratica,
      tipo_cliente: tipoCliente,
      tipo_fornitura: tipoFornitura,
      nome, cognome, email, telefono, codice_fiscale: codiceFiscale,
      ragione_sociale: ragioneSociale,
      partita_iva: partitaIva,
      residenza: residenza,
      luogo_fornitura: isStessaResidenza ? residenza : luogoFornitura,
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
      setErrore("Il server ci sta mettendo troppo tempo a svegliarsi. Riprova tra 30 secondi.");
    } finally {
      setLoading(false);
    }
  };

  const inviaScelta = async (offerta) => {
    setLoading(true);
    setErrore(null);
    
    const payload = {
      tipo_pratica: tipoPratica,
      tipo_cliente: tipoCliente,
      tipo_fornitura: tipoFornitura,
      nome, cognome, email, telefono, codice_fiscale: codiceFiscale,
      ragione_sociale: ragioneSociale,
      partita_iva: partitaIva,
      residenza: residenza,
      luogo_fornitura: isStessaResidenza ? residenza : luogoFornitura,
      pod: pod,
      pdr: pdr,
      offerta_scelta: `${offerta.fornitore} - ${offerta.offerta}`
    };

    try {
      const response = await fetch('https://bqyyhpmxatvuxvlnwdwp.supabase.co/rest/v1/lead_scelte', {
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
        setErrore("Errore salvataggio DB: " + erroreDettaglio);
      }
    } catch (error) {
      setErrore("Errore di connessione al database.");
    } finally {
      setLoading(false);
    }
  };

  const s = {
    body: { backgroundColor: '#0f172a', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif', display: 'flex', flexDirection: 'column' },
    nav: { padding: '20px 0', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' },
    logoText: { fontSize: '26px', fontWeight: '800', letterSpacing: '-0.5px', color: '#ffffff', margin: 0 },
    logoDot: { color: '#3b82f6' },
    mainContainer: { flex: 1, display: 'flex', justifyContent: 'center', padding: '20px 20px 60px 20px' },
    card: { width: '100%', maxWidth: '700px', backgroundColor: '#ffffff', borderRadius: '20px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)', padding: '40px', boxSizing: 'border-box' },
    title: { fontSize: '24px', fontWeight: '700', color: '#111827', marginTop: 0, marginBottom: '8px' },
    subtitle: { fontSize: '15px', color: '#6b7280', marginTop: 0, marginBottom: '32px' },
    sectionTitle: { fontSize: '14px', fontWeight: '600', color: '#111827', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px', marginTop: '28px', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' },
    inputGroup: { marginBottom: '16px' },
    label: { display: 'block', fontSize: '14px', fontWeight: '500', color: '#111827', marginBottom: '6px' },
    input: { width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '15px', color: '#111827', boxSizing: 'border-box', backgroundColor: '#f9fafb' },
    row: { display: 'flex', gap: '16px' },
    col: { flex: 1 },
    checkboxGroup: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', cursor: 'pointer' },
    btnPrimary: { width: '100%', padding: '16px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', marginTop: '24px' },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '16px' },
    th: { padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6b7280', borderBottom: '1px solid #e5e7eb', textTransform: 'uppercase' },
    td: { padding: '16px 12px', fontSize: '15px', color: '#111827', borderBottom: '1px solid #e5e7eb' },
    btnScegli: { backgroundColor: '#111827', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' },
    successBox: { textAlign: 'center', padding: '40px 20px' },
    successIcon: { width: '64px', height: '64px', backgroundColor: '#ecfdf5', color: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto' },
    error: { backgroundColor: '#fef2f2', color: '#b91c1c', padding: '12px', borderRadius: '8px', fontSize: '14px', marginBottom: '20px', border: '1px solid #fecaca' },
    radioGroup: { display: 'flex', gap: '20px', marginBottom: '20px' },
    radioLabel: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', fontWeight: '500', cursor: 'pointer' }
  };

  return (
    <div style={s.body}>
      <nav style={s.nav}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#3b82f6" />
        </svg>
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
              <p style={{ color: '#6b7280', fontSize: '16px', lineHeight: '1.5', marginBottom: '32px' }}>
                Grazie <strong>{tipoCliente === 'azienda' ? ragioneSociale : nome}</strong>, abbiamo registrato la tua richiesta di <strong>{tipoPratica}</strong>.<br/>
                Un nostro consulente ti contatterà <strong>entro 48 ore</strong> ai recapiti forniti.
              </p>
              <button onClick={() => window.location.reload()} style={{...s.btnPrimary, backgroundColor: '#e5e7eb', color: '#111827'}}>Torna alla home</button>
            </div>
          ) : (
            <>
              <h2 style={s.title}>Confronta le offerte</h2>
              <p style={s.subtitle}>Scopri in 1 minuto come risparmiare su luce, gas e fibra.</p>

              <form onSubmit={gestisciInvio}>
                
                {/* TIPO DI PRATICA */}
                <div style={s.sectionTitle}>Cosa devi fare?</div>
                <div style={s.inputGroup}>
                  <select style={s.input} value={tipoPratica} onChange={(e) => setTipoPratica(e.target.value)}>
                    <option value="Switch">Switch (Cambio Fornitore)</option>
                    <option value="Nuova Attivazione">Nuova Attivazione (Allaccio)</option>
                    <option value="Subentro">Subentro (Casa disabitata)</option>
                    <option value="Voltura">Voltura (Cambio Intestatario)</option>
                  </select>
                </div>

                {/* TIPO CLIENTE */}
                <div style={s.sectionTitle}>Tipo di Cliente</div>
                <div style={s.radioGroup}>
                  <label style={s.radioLabel}>
                    <input type="radio" value="privato" checked={tipoCliente === 'privato'} onChange={() => setTipoCliente('privato')} />
                    Privato
                  </label>
                  <label style={s.radioLabel}>
                    <input type="radio" value="azienda" checked={tipoCliente === 'azienda'} onChange={() => setTipoCliente('azienda')} />
                    Azienda / Partita IVA
                  </label>
                </div>

                <div style={s.sectionTitle}>Dati Anagrafici</div>
                
                {tipoCliente === 'azienda' ? (
                  <div style={s.row}>
                    <div style={{...s.inputGroup, ...s.col}}>
                      <label style={s.label}>Ragione Sociale</label>
                      <input type="text" style={s.input} value={ragioneSociale} onChange={(e) => setRagioneSociale(e.target.value)} required />
                    </div>
                    <div style={{...s.inputGroup, ...s.col}}>
                      <label style={s.label}>Partita IVA</label>
                      <input type="text" style={s.input} value={partitaIva} onChange={(e) => setPartitaIva(e.target.value)} required />
                    </div>
                  </div>
                ) : (
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
                )}

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
                  {tipoCliente === 'privato' && (
                    <div style={{...s.inputGroup, ...s.col}}>
                      <label style={s.label}>Codice Fiscale</label>
                      <input type="text" style={s.input} value={codiceFiscale} onChange={(e) => setCodiceFiscale(e.target.value)} required />
                    </div>
                  )}
                  <div style={{...s.inputGroup, ...s.col}}>
                    <label style={s.label}>Indirizzo Sede/Residenza</label>
                    <input type="text" style={s.input} value={residenza} onChange={(e) => setResidenza(e.target.value)} placeholder="Via, Civico, Città" required />
                  </div>
                </div>

                <div style={s.sectionTitle}>Dettagli Fornitura</div>
                <div style={s.inputGroup}>
                  <label style={s.label}>Cosa vuoi confrontare?</label>
                  <select style={s.input} value={tipoFornitura} onChange={(e) => setTipoFornitura(e.target.value)}>
                    <option value="luce">Solo Luce</option>
                    <option value="gas">Solo Gas</option>
                    <option value="duale">Luce + Gas (Dual Fuel)</option>
                    <option value="fibra">Fibra Internet</option>
                  </select>
                </div>

                {tipoFornitura !== 'fibra' && (
                  <>
                    <div style={s.checkboxGroup} onClick={() => setIsStessaResidenza(!isStessaResidenza)}>
                      <input type="checkbox" checked={isStessaResidenza} onChange={() => {}} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                      <label style={{...s.label, marginBottom: 0, cursor: 'pointer' }}>Il luogo di fornitura coincide con la sede/residenza</label>
                    </div>

                    {!isStessaResidenza && (
                      <div style={s.inputGroup}>
                        <label style={s.label}>Indirizzo Luogo di Fornitura</label>
                        <input type="text" style={s.input} value={luogoFornitura} onChange={(e) => setLuogoFornitura(e.target.value)} placeholder="Via, Civico, Città" required />
                      </div>
                    )}

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
                  </>
                )}

                <button type="submit" disabled={loading} style={s.btnPrimary}>
                  {loading ? 'Ricerca in corso...' : 'Confronta Offerte Gratis'}
                </button>
              </form>

              {risultati && (
                <div style={{ marginTop: '40px' }}>
                  <h3 style={{ fontSize: '18px', color: '#111827', marginBottom: '8px' }}>Offerte disponibili</h3>
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
