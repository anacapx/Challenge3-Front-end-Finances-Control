import './App.css';
import { useEffect, useState } from 'react';
import { format, getDay, parse, parseJSON } from 'date-fns';
import { Modal } from './components/Modal'
import { Filters } from './components/Filters';
import { Table } from './components/Table';
import { Resume } from './components/Resume';

function App() {

  const [allTransactions, setAllTransactions] = useState([]);
  const [displayedTransactions, setDisplayedTransactions] = useState([]);
  const [modal, setModal] = useState({
    transactionType: '',
    actionType: '',
    transaction: '',
    open: false
  });
  const [form, setForm] = useState({
    value: 0,
    category: '',
    date: '',
    description: ''
  });
  const [transactionInEditing, setTransactionInEditing] = useState(false);
  const [resume, setResume] = useState({ entradas: 0, saidas: 0, saldo: 0 });
  const [order, setOrder] = useState({ field: '', orderAsc: false });
  const [filterOpen, setFilterOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [deletePopUpOpen, setDeletePopUpOpen] = useState({ tansactioId: '', open: false });
  const [filters, setFilters] = useState({ minValue: '', maxValue: '' });
  const [filterWeekdays, setFilterWeekdays] = useState([]);
  const [filterCategory, setFilterCategory] = useState([]);

  function handleFilters(e) {
    e.preventDefault();
    setFilters({ ...filters, [e.target.name]: e.target.value })
  }

  function handleSelectCategory(e) {
    e.preventDefault();

    let tempCategoryFilterList = [...filterCategory]

    if (!(filterCategory.includes(e.target.attributes[1].nodeValue))) {
      tempCategoryFilterList.push(e.target.attributes[1].nodeValue)
    } else {
      tempCategoryFilterList = tempCategoryFilterList.filter((category) => category !== e.target.attributes[1].nodeValue)
    }
    setFilterCategory(tempCategoryFilterList)
  }

  function handleSelectWeekday(e) {
    e.preventDefault();
    let tempWeekdaysFilterList = [...filterWeekdays]

    if (!(filterWeekdays.includes(e.target.attributes[1].nodeValue))) {
      tempWeekdaysFilterList.push(e.target.attributes[1].nodeValue)
    } else {
      tempWeekdaysFilterList = tempWeekdaysFilterList.filter((weekday) => weekday !== e.target.attributes[1].nodeValue)
    }
    setFilterWeekdays(tempWeekdaysFilterList)
  }

  function applyFilter(e) {
    e.preventDefault();
    let filteredTransactions = [...allTransactions]

    if (filters.maxValue > 0) {
      filteredTransactions = filteredTransactions.filter((transaction) => {
        return transaction.value >= filters.minValue * 100 && transaction.value <= filters.maxValue * 100
      })
    }

    if (!filters.maxValue) {
      filteredTransactions = filteredTransactions.filter((transaction) => {
        return transaction.value >= filters.minValue * 100
      })
    }


    if (filterWeekdays.length !== 0) {
      filteredTransactions = filteredTransactions.filter((transaction) =>
        filterWeekdays.includes(transaction.week_day)
      )
    }
    if (filterCategory.length !== 0) {
      filteredTransactions = filteredTransactions.filter((transaction) =>
        filterCategory.includes(transaction.category)
      )
    }
    setDisplayedTransactions(filteredTransactions)
  }

  function handleClearFilters(e) {
    e.preventDefault();
    setFilters({ minValue: '', maxValue: '' });
    setFilterWeekdays([]);
    setFilterCategory([]);
    setDisplayedTransactions(allTransactions)
  }

  useEffect(() => {
    listAllTransactions()
  }, []);

  useEffect(() => {
    function total() {
      let entradasTemp = 0;
      let saidasTemp = 0;
      displayedTransactions.map(function (transaction) {
        return (
          transaction.type === 'debit' ?
            saidasTemp += Number(transaction.value) :
            entradasTemp += Number(transaction.value)
        )
      })
      let saldoTemp = entradasTemp - saidasTemp;
      setResume({
        entradas: entradasTemp,
        saidas: saidasTemp,
        saldo: saldoTemp
      })
    }
    total()
  }, [displayedTransactions]);

  useEffect(() => {
    function listCategories() {
      let tempCategories = [];
      allTransactions.forEach(function (transaction) {
        if (!tempCategories.includes(transaction.category)) {
          tempCategories.push(transaction.category)
        }
      })
      setCategories(tempCategories)
    }
    listCategories()
  }, [allTransactions])

  function handleSubmit(event) {
    event.preventDefault();
  }

  async function listAllTransactions() {
    try {
      const response = await fetch('http://localhost:3333/transactions', {
        method: 'GET'
      });
      const data = await response.json();

      data.forEach(transaction => {
        transaction.date = parseJSON(transaction.date)
      });

      setAllTransactions(data);
      setDisplayedTransactions(data);

    } catch (error) {
      console.log(error);
    }
  }

  async function handleRegisterTransaction(event) {
    event.preventDefault();
    const weekday = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
    const body = {
      date: parse(form.date, 'yyyy-MM-dd', new Date()),
      week_day: weekday[parse(form.date, 'yyyy-MM-dd', new Date()).getDay()],
      description: form.description,
      value: Number(form.value) * 100,
      category: form.category,
      type: modal.transactionType
    };

    if (!body.description || !body.category || !body.value || !form.date) {
      return
    } else {
      try {
        await fetch('http://localhost:3333/transactions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });

        listAllTransactions();

        setForm({
          value: 0,
          category: '',
          date: '',
          description: ''
        })

        setModal({
          transactionType: '',
          actionType: '',
          transaction: '',
          open: false
        })

      } catch (error) {
        console.log(error);
      }
    }
  }

  function handleTransactionInEditing(transaction) {
    setTransactionInEditing(transaction);
    setForm({
      value: (transaction.value / 100).toFixed(2),
      category: transaction.category,
      date: format(transaction.date, 'yyyy-MM-dd'),
      description: transaction.description,
      type: transaction.type
    })

    handleModal('edit', transaction.type, transaction)
  }

  async function handleEditTransaction(event) {
    event.preventDefault();
    const weekday = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
    const body = {
      date: parse(form.date, 'yyyy-MM-dd', new Date()),
      week_day: weekday[getDay(parse(form.date, 'yyyy-MM-dd', new Date()))],
      description: form.description,
      value: Number(form.value) * 100,
      category: form.category,
      type: modal.transactionType
    };

    if (!body.description || !body.category || !body.value || !form.date) {
      return
    } else {
      try {
        await fetch(`http://localhost:3333/transactions/${transactionInEditing.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });

        setTransactionInEditing(false);
        setForm({
          value: 0,
          category: '',
          date: '',
          description: ''
        });
        setModal({
          transactionType: '',
          actionType: '',
          transaction: '',
          open: false
        })

        listAllTransactions();

      } catch (error) {
        console.log(error);
      }
    }
  }

  function handleDeletePopUp(id) {
    setDeletePopUpOpen({
      transactionId: id,
      open: true
    });
  }

  async function handleDeleteTransaction(transactionId) {
    try {
      await fetch(`http://localhost:3333/transactions/${transactionId}`, {
        method: 'DELETE',
      });
      setDeletePopUpOpen({ tansactioId: '', open: false });

      listAllTransactions();

    } catch (error) {
      console.log(error)
    }
  }

  function handleFilterOpen() {
    setFilterOpen(!filterOpen)
  }

  function ordenar(ordenador) {
    let tempOrder = { ...order }
    let tempTransactions = [...displayedTransactions]

    if (!tempOrder.field) {
      tempOrder.field = ordenador
    }

    if (tempOrder.field === ordenador) {
      tempOrder.orderAsc = !tempOrder.orderAsc
    } else {
      tempOrder.orderAsc = true
    }

    tempOrder.field = ordenador

    setOrder(tempOrder)

    if (ordenador === 'value') {
      if (tempOrder.orderAsc) {
        tempTransactions.sort(function (a, b) { return a.value - b.value });
      }
      if (!tempOrder.orderAsc) {
        tempTransactions.reverse(function (a, b) { return a.value - b.value });
      }
    }

    if (ordenador === 'date') {
      if (tempOrder.orderAsc) {
        tempTransactions.sort(function (a, b) { return a.date.getTime() - b.date.getTime() });
      }
      if (!tempOrder.orderAsc) {
        tempTransactions.reverse(function (a, b) { return a.date.getTime() - b.date.getTime() });
      }
    }

    if (ordenador === 'week_day') {
      if (tempOrder.orderAsc) {
        tempTransactions.sort(function (a, b) { return getDay(a.date) - getDay(b.date) });
      }
      if (!tempOrder.orderAsc) {
        tempTransactions.reverse(function (a, b) { return getDay(a.date) - getDay(b.date) });
      }
    }
    setDisplayedTransactions(tempTransactions)
  }

  function handleModal(actionType, transactionType, transaction) {
    const modalTemp = { ...modal }
    modalTemp.actionType = actionType;
    modalTemp.transactionType = transactionType;
    modalTemp.transaction = transaction;
    modalTemp.open = true;
    setModal(modalTemp)
  }

  function handleCreditButton() {
    const modalTemp = { ...modal }
    modalTemp.transactionType = 'credit';
    setModal(modalTemp)
  };

  function handleDebitButton() {
    const modalTemp = { ...modal }
    modalTemp.transactionType = 'debit';
    setModal(modalTemp)
  };

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  function handleFecharModal() {
    const modalTemp = { ...modal }
    modalTemp.open = false;
    setModal(modalTemp)
  }

  return (
    <div className="App">
      <header className="container-header">
        <img src="./assets/logo-dindin-1.svg" alt="Logo" />

      </header>

      <div className="main">

        <div className='open-filters-button' onClick={() => handleFilterOpen()}>
          <img src="./assets/filtro.svg" alt="Filtrar" />
          <span>Filtrar</span>
        </div>

        <div className="container">

          <div className='container-left'>
            <Filters
              categories={categories}
              filters={filters}
              handleFilters={handleFilters}
              handleClearFilters={handleClearFilters}
              applyFilter={applyFilter}
              filterOpen={filterOpen}
              handleSelectWeekday={handleSelectWeekday}
              filterWeekdays={filterWeekdays}
              handleSelectCategory={handleSelectCategory}
              filterCategory={filterCategory}
            >
            </Filters>

            <Table
              ordenar={ordenar}
              order={order}
              displayedTransactions={displayedTransactions}
              handleTransactionInEditing={handleTransactionInEditing}
              handleDeletePopUp={handleDeletePopUp}
              deletePopUpOpen={deletePopUpOpen}
              handleDeleteTransaction={handleDeleteTransaction}
            >
            </Table>

          </div>

          <div className='container-right'>
            <Resume
              resume={resume}
            >
            </Resume>

            <button className='btn-add' onClick={() => handleModal('add', 'debit')}>
              Adicionar Registro
            </button>
          </div>
        </div>
      </div>
      <Modal
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        handleFecharModal={handleFecharModal}
        handleCreditButton={handleCreditButton}
        handleDebitButton={handleDebitButton}
        handleRegisterTransaction={handleRegisterTransaction}
        handleEditTransaction={handleEditTransaction}
        modal={modal}
        form={form}
      >
      </Modal>
    </div >
  );
}

export default App;