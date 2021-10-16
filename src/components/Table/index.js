import './style.css'
import { format } from 'date-fns';

export function Table(props) {

    return (
        <div className='table'>
            <div className='table-head'>
                <div
                    className='column-title'
                    id='date'
                    onClick={() => props.ordenar('date')}>
                    <span>Data </span>
                    <img
                        className={props.order.field === 'date' && props.order.orderAsc ? '' : 'hidden'}
                        src="./assets/seta-para-cima.svg"
                        alt="Seta para cima" />
                    <img
                        className={props.order.field === 'date' && !props.order.orderAsc ? '' : 'hidden'}
                        src="./assets/seta-para-baixo.svg"
                        alt="Seta para baixo" />
                </div>
                <div
                    className='column-title'
                    id='week-day'
                    onClick={() => props.ordenar('week_day')}>
                    <span>Dia da semana </span>
                    <img
                        className={props.order.field === 'week_day' && props.order.orderAsc ? '' : 'hidden'}
                        src="./assets/seta-para-cima.svg"
                        alt="Seta para cima" />
                    <img
                        className={props.order.field === 'week_day' && !props.order.orderAsc ? '' : 'hidden'}
                        src="./assets/seta-para-baixo.svg"
                        alt="Seta para baixo" />
                </div>
                <div className='column-title' id='description'>Descrição</div>
                <div className='column-title' id='category'>Categoria</div>
                <div
                    className='column-title'
                    id='value'
                    onClick={() => props.ordenar('value')}>
                    <span>Valor </span>
                    <img
                        className={props.order.field === 'value' && props.order.orderAsc ? '' : 'hidden'}
                        src="./assets/seta-para-cima.svg"
                        alt="Seta para cima" />
                    <img
                        className={props.order.field === 'value' && !props.order.orderAsc ? '' : 'hidden'}
                        src="./assets/seta-para-baixo.svg"
                        alt="Seta para baixo" />
                </div>
                <div className='column-title' ></div>
            </div>

            <div className='table-body'>
                {props.displayedTransactions.map(function (transaction) {
                    let formattedDate = format(transaction.date, 'dd/MM/yyyy')
                    return (
                        <ul className='table-line' key={transaction.id}>
                            <li className='line-items'>
                                {formattedDate}
                            </li >
                            <li className='line-items'>
                                {transaction.week_day}
                            </li>
                            <li className='line-items'>
                                {transaction.description}
                            </li>
                            <li className='line-items'>
                                {transaction.category}
                            </li>
                            <li className={`line-items ${transaction.type === 'credit' ? 'in' : 'out'}`}>
                                {`${transaction.type === 'credit' ? '' : '-'} ${(transaction.value / 100).toLocaleString("pt-br", { style: "currency", currency: "BRL" })}`}
                            </li>
                            <li className='line-items table-buttons '>
                                <img
                                    className='edit-icon'
                                    src="./assets/editar.svg"
                                    alt="Editar"
                                    onClick={() => props.handleTransactionInEditing(transaction)}
                                />
                                <img
                                    className='delete-icon'
                                    src="./assets/lixeira.svg"
                                    alt="Apagar"
                                    onClick={() => props.handleDeletePopUp(transaction.id)}
                                />
                                <div className={`container-confirm-delete ${props.deletePopUpOpen.open && props.deletePopUpOpen.transactionId === transaction.id ? '' : 'hidden'}`}>
                                    <img src="./assets/seta-container-delete.svg" alt="" />
                                    <span>Apagar item?</span>
                                    <div>
                                        <button
                                            className='btn-actions-confirm-delete button-actions-confirm'
                                            onClick={() => props.handleDeleteTransaction(transaction.id)}>
                                            Sim
                                        </button>
                                        <button
                                            className='btn-actions-confirm-delete button-actions-cancel'
                                            onClick={() => props.handleDeletePopUp()}>
                                            Não
                                        </button>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    )
                })}
            </div>
        </div>
    )
}