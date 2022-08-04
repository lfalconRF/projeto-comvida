/* eslint-disable no-lone-blocks */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaFlag } from 'react-icons/fa'
import Tooltip from '../tooltip/index.jsx'

import { AuthContext } from '../../contexts/auth'

import './styles.css'

const TableInfo = () => {
  const {
    user,
    tutors,
    children_teenagers,
    getResults,
    getQuestionario,
    getChildren,
    getTutors,
    getExams,
    results,
    loading,
    exams,
  } = useContext(AuthContext)
  const navigate = useNavigate()

  const [participants, setParticipants] = useState([])
  const [listOfResults, setListOfResults] = useState({})
  const [isOpenScheduledModal, setIsOpenScheduledModal] = useState(false)
  const [isOpenThankfulModal, setIsOpenThankfulModal] = useState(false)
  const [isOpenLoadingOrderModal, setIsOpenLoadingOrderModal] = useState(false)
  const [loadingAnswer, setLoadingAnswer] = useState(loading)
  const [personChoosed, setPersonChoosed] = useState(0)

  useEffect(async () => {
    await getExams()
    await getChildren()
    await getTutors()
    await getResults()
  }, [])

  useEffect(async () => {
    if (personChoosed !== 0) {
      setListOfResults(await getQuestionario(personChoosed))
      setLoadingAnswer(false)
    }

  }, [isOpenThankfulModal, personChoosed])

  useEffect(() => {
    setLoadingAnswer(loading)
  }, [loading])

  const handleFindTheRelation = () => {
    const listOfPeople = []
    const tutorsWithoutTutored = []
    let tutored
    let lineOfTable
    tutors?.map((tutor) => {
      if (tutor.child_teen.length) {
        for (let count = 0; count < tutor.child_teen.length; count++) {
          tutored = handleReturnTutored(tutor.child_teen[count])
          lineOfTable = {
            name: tutored?.name,
            age_range: tutored?.age_range,
            tutor: tutor?.name,
            questionnaires: tutored?.questionnaires,
            appointment_scheduled: tutored?.appointment_scheduled,
          }
          listOfPeople.push(lineOfTable)
        }
      } else {
        tutorsWithoutTutored.push(tutor?.name)
      }

      return tutor
    })
    // setListOfParticipants({ listOfPeople, tutorsWithoutTutored })
  }

  const handleReturnTutored = (valueId) => {
    return children_teenagers.find((element) => element.id === valueId)
  }

  const handleCountAnwsers = (questionnaires) => {
    let countTrue = 0,
      countFalse = 0
    questionnaires?.map((question) => (question ? countTrue++ : countFalse++))

    if (countFalse === questionnaires?.length) {
      return (
        <Tooltip content="Nenhum questionario respondido" direction="right">
          <FaFlag alt="Red Flag" style={{ color: '#ff0000', width: '30px', height: '30px' }} />
        </Tooltip>
      )
    } else if (countTrue < countFalse) {
      return (
        <Tooltip content="Menos da metade foi respondido" direction="right">
          <FaFlag alt="Orange Flag" style={{ color: '#ff8000', width: '30px', height: '30px' }} />
        </Tooltip>
      )
    } else if (countTrue === questionnaires?.length) {
      return (
        <Tooltip content="Todos questionarios respondidos" direction="right">
          <FaFlag alt="Green Flag" style={{ color: '#00ff00', width: '30px', height: '30px' }} />
        </Tooltip>
      )
    }
    return (
      <Tooltip content="Mais da metade foi respondido" direction="right">
        <FaFlag alt="Yellow Flag" style={{ color: '#ffff00', width: '30px', height: '30px' }} />
      </Tooltip>
    )
  }

  const handleCreateHeaderTable = () => {
    return isOpenThankfulModal ? (
      <tr>
        <th key={'perguntaQuest'} className="cabecalho" onClick={() => sortTable(0)}>
          Pergunta do Questionario
        </th>
        <th key={'respostaQuest'}>Resposta da Pergunta</th>
        <th key={'botaoVoltarTabela'}>Botão para voltar a tabela </th>
      </tr>
    ) : (
      <tr>
        <th key={'idUser'} className="cabecalho" onClick={() => sortTable(0)}>
          id User
        </th>
        <th key={'nome'} className="cabecalho" onClick={() => sortTable(1)}>
          Nome
        </th>
        <th key={'idTutor'} className="cabecalho" onClick={() => sortTable(2)}>
          id Tutor
        </th>
        <th key={'crianca'} className="cabecalho" onClick={() => sortTable(3)}>
          Nome da Criança/Adolescente
        </th>
        <th key={'idCrianca'} className="cabecalho" onClick={() => sortTable(4)}>
          id Criança/Adolescente
        </th>
        <th key={'faixaEtaria'}>Faixa Etaria</th>
        <th key={'idQuestionario'} className="cabecalho" onClick={() => sortTable(6)}>
          id do Questionario
        </th>
        {/* <th key={'questComplete'}>Quantidade de Respostas</th> */}
        <th key={'respostasQuest'}>Respostas do Questionario</th>
      </tr>
    )
  }

  const handleOpenScheduled = (event, person) => {
    console.log(event)
    setIsOpenScheduledModal(true)
    setPersonChoosed({ name: person })
  }

  const handleCreateTheTable = () => {
    return isOpenThankfulModal ?
      listOfResults?.result_answers?.map((objeto) => {
        return (
          <tr key={objeto?.id} className="lineTable">
            <td>{objeto?.question?.title}</td>
            <td>{objeto?.answer?.title || objeto?.answer}</td>
            <td>
              <button
                onClick={() => {
                  setIsOpenThankfulModal(false)
                  setPersonChoosed(0)
                }}
                className="close-button"
              >
                Voltar na tabela
              </button>
            </td>
          </tr>
        )})
     : results?.map((listaObjetos) => {
       return listaObjetos?.map((objeto) => {
         if (
           !(
             objeto.tutor?.name.toLowerCase().includes('test') ||
             objeto.tutor?.name.toLowerCase().includes('tutor') ||
             objeto.tutor?.name.toLowerCase().includes('app') ||
             objeto.child?.name.toLowerCase().includes('test') ||
             objeto.child?.name.toLowerCase().includes('adolescente') ||
             objeto.child?.name.toLowerCase().includes('crian') ||
             objeto.child?.name.toLowerCase().includes('teen') ||
             objeto.child?.name.toLowerCase().includes('child') ||
             objeto.child?.name.toLowerCase().includes('kid') ||
             objeto.child?.name.toLowerCase().includes('mulher')
           )
         ) {
           return (
             <tr key={objeto?.id} className="lineTable">
               <td>{objeto.tutor?.user || objeto.child?.user}</td>
               <td>{objeto.tutor?.name}</td>
               <td>{objeto.tutor?.id}</td>
               <td>{objeto.child?.name}</td>
               <td>{objeto.child?.id}</td>
               <td>{objeto.child?.age_range}</td>
               <td>{objeto.exam?.id}</td>
               {/* <td>{await handleQuantityQuestion(objeto.id)}</td> */}
               <td>
                 <button
                   onClick={() => {
                     setIsOpenThankfulModal(true)
                     setPersonChoosed(objeto.id)
                     setLoadingAnswer(true)
                   }}
                   className="close-button"
                 >
                   Abrir Questionarios
                 </button>
               </td>
             </tr>
           )
         }
      })
    })
  }

  const handleQuantityQuestion = async (idExam) => {
    let value = await getQuestionario(idExam)
    console.log('This is handleQuantity')
    const valueFinded = exams.find(exam => exam.numberId === value?.exam?.id)
    return `${value?.result_answers?.length}/${valueFinded.sizeQuestions}`
  }

  const sortTable = (n) => {
    console.log('sortTable sortTable')
    setIsOpenLoadingOrderModal(true)
    var table,
      rows,
      switching,
      i,
      x,
      y,
      shouldSwitch,
      dir,
      switchcount = 0
    table = document.getElementById('child_teen')
    switching = true
    dir = 'asc'
    while (switching) {
      switching = false
      rows = table.getElementsByTagName('TR')
      for (i = 1; i < rows.length - 1; i++) {
        shouldSwitch = false
        x = rows[i].getElementsByTagName('TD')[n]
        y = rows[i + 1].getElementsByTagName('TD')[n]
        let cmpX = isNaN(parseInt(x.innerHTML)) ? x.innerHTML.toLowerCase() : parseInt(x.innerHTML)
        let cmpY = isNaN(parseInt(y.innerHTML)) ? y.innerHTML.toLowerCase() : parseInt(y.innerHTML)
        if (dir === 'asc') {
          if (cmpX > cmpY) {
            shouldSwitch = true
            break
          }
        } else if (dir === 'desc') {
          if (cmpX < cmpY) {
            shouldSwitch = true
            break
          }
        }
      }
      if (shouldSwitch) {
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i])
        switching = true
        switchcount++
      } else {
        if (switchcount === 0 && dir === 'asc') {
          dir = 'desc'
          switching = true
        }
      }
    }
    setIsOpenLoadingOrderModal(false)
  }

  const handleSubmitScheduled = (event) => {
    event.preventDefault()
    const date = event.target[0].value
    const hour = event.target[1].value
    const observation = event.target[2].value
    setPersonChoosed({ scheduled: date && hour, date: date, hour: date, observation: observation })
    setIsOpenScheduledModal(false)
    setIsOpenThankfulModal(true)
    setTimeout(() => {
      setIsOpenThankfulModal(false)
    }, 3000)
  }

  return (
    <div id="main_container">
      <table id="child_teen">
        <thead>{handleCreateHeaderTable()}</thead>
        <tbody>
          {loadingAnswer ? (
            <div class="loader-container">
              <span>Carregando os dados...</span>
              <div class="loader">
                <div></div>
                <div></div>
              </div>
            </div>
          ) : (
            handleCreateTheTable()
          )}
        </tbody>
      </table>
      {/* isOpenScheduledModal && (
        <>
          <div className="overlay" />
          <div className="modal">
            <main className="modal__main">
              <form onSubmit={handleSubmitScheduled}>
                <div className="labels">
                  <label className="input">Consulta Marcada:</label>
                  <span className="input"> {personChoosed?.scheduled ? 'Sim' : 'Não'}</span>
                </div>
                <br />
                <div className="labels">
                  <label className="input">Data:</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    style={{ height: '35px' }}
                    defaultValue={personChoosed?.date}
                    required
                  />
                </div>
                <br />
                <div className="labels">
                  <label className="input">Horário:</label>
                  <input
                    type="time"
                    id="hour"
                    name="appt"
                    min="08:00"
                    max="19:00"
                    style={{ height: '35px' }}
                    defaultValue={personChoosed?.date}
                    required
                  />
                </div>
                <br />
                <div className="labels observation">
                  <label className="input">Observação:</label>
                  <textarea
                    id="observation"
                    name="observation"
                    rows="7"
                    cols="55"
                    defaultValue={personChoosed?.observation}
                  />
                </div>
                <br />
                <div className="collection-buttons">
                  <input type="submit" value="Submit" className="submit-button" />
                  <button onClick={() => setIsOpenScheduledModal(false)} className="close-button">
                    Cancel
                  </button>
                </div>
              </form>
            </main>
          </div>
        </>
      )} */}
      {/* {isOpenLoadingOrderModal && (
        <>
          <div id="overlay" />
          <div id="modal">
            <main id="modal__main">
              <p>Ordenando Tabela...</p>
            </main>
          </div>
        </>
      )} */}
    </div>
  )
}

export default TableInfo
