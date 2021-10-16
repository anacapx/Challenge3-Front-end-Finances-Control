import './style.css'

export function Modal(props) {
    return (
        <div className={props.modal.open ? 'modal' : 'hidden'}>
            <div className="modal-container">
                <img
                    className="close-icon"
                    onClick={props.handleFecharModal}
                    src="./assets/close.svg"
                    alt="Fechar"
                />
                <h1>
                    {props.modal.actionType === 'add' ? 'Adicionar Registro' : 'Alterar Registro'}
                </h1>
                <div className="modal-buttons">
                    <button
                        id="credit-button"
                        className={props.modal.transactionType === 'credit' ? 'credit-button-on' : 'button-off'}
                        onClick={props.handleCreditButton} >
                        Entrada
                    </button>
                    <button
                        id="debit-button"
                        className={props.modal.transactionType === 'debit' ? 'debit-button-on' : 'button-off'}
                        onClick={props.handleDebitButton}>
                        Saída
                    </button>
                </div>
                <form onSubmit={props.handleSubmit}>
                    <div className="modal-input">
                        <label htmlFor="value">Valor</label>
                        <input
                            name="value"
                            id="value"
                            type="number"
                            value={props.form.value}
                            onChange={props.handleChange}
                        />
                    </div>
                    <div className="modal-input">
                        <label htmlFor="category">Categoria</label>
                        <input
                            name="category"
                            id="category"
                            type="text"
                            value={props.form.category}
                            onChange={props.handleChange}
                        />
                    </div>
                    <div className="modal-input">
                        <label htmlFor="date">Data</label>
                        <input
                            className="input-date"
                            name="date"
                            id="date"
                            type="date"
                            value={props.form.date}
                            onChange={props.handleChange}
                        />
                    </div>
                    <div className="modal-input">
                        <label htmlFor="description">Descrição</label>
                        <input
                            name="description"
                            id="description"
                            type="text"
                            value={props.form.description}
                            onChange={props.handleChange} />
                    </div>
                    <button
                        className="btn-insert"
                        type="submit"
                        onClick={props.modal.actionType === 'edit' ? props.handleEditTransaction : props.handleRegisterTransaction}>
                        Confirmar
                    </button>
                </form>
            </div>
        </div>
    )
}
