import './style.css'

export function Resume(props) {

  return (
    <div className='container-resume'>
      <h2>Resumo</h2>
      <div>
        <span>Entradas</span>
        <div className='in'>
          {(props.resume.entradas / 100).toLocaleString("pt-br", { style: "currency", currency: "BRL" })}
        </div>
      </div>
      <div>
        <span>Saídas</span>
        <div className='out'>
          {(props.resume.saidas / 100).toLocaleString("pt-br", { style: "currency", currency: "BRL" })}
        </div>
      </div>
      <div className='saldo'>
        <span>Saldo</span>
        <div className='balance'>{(props.resume.saldo / 100).toLocaleString("pt-br", { style: "currency", currency: "BRL" })}</div>
      </div>
    </div>
  )
}