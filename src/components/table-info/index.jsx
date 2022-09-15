/* eslint-disable array-callback-return */
/* eslint-disable no-lone-blocks */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from 'react'
// import { useNavigate } from 'react-router-dom'
import { FaFlag } from 'react-icons/fa'
import Tooltip from '../tooltip/index.jsx'

import { AuthContext } from '../../contexts/auth'

import './styles.css'

const TableInfo = () => {
  const {
    tutors,
    childrenTeen,
    finishedChildren,
    finishedTutors,
    quantityChildren,
    quantityTutors,
    getQuestionario,
    setFinishedChildren,
    setFinishedTutors,
    setLoading,
    setTutorsFiltered,
    setChildrenTeenFiltered,
    getResults,
    loading,
    isOpenQuestionaryModal,
    setIsOpenQuestionaryModal,
    exams,
    getExams,
  } = useContext(AuthContext)

  const [listOfResults, setListOfResults] = useState([])
  const [lengthListOfResults, setLengthListOfResults] = useState([])
  const [percentagensQuestionary, setPercentagensQuestionary] = useState([])
  const [isLoadingQuestionaryPerson, setIsLoadingQuestionaryPerson] = useState(false)
  const [loadingAnswer, setLoadingAnswer] = useState(loading)
  const [personChoosed, setPersonChoosed] = useState(0)

  useEffect(async () => {
    if (quantityTutors) {
      await setTutorsFiltered()
    }
    if (quantityChildren) {
      await setChildrenTeenFiltered()
    }
  }, [quantityChildren, quantityTutors])

  useEffect(async () => {
    if (finishedChildren && finishedTutors) {
      tutors.forEach((tutor) => {
        childrenTeen.forEach((child) => {
          if (
            child.user === tutor.tutor.user &&
            (child.user !== null || tutor.tutor.user !== null)
          ) {
            tutor.children.push(child)
          }
        })
      })
      console.log('Tutors', tutors)
      console.log('Children', childrenTeen)
      await getExams()
      setFinishedChildren(false)
      setFinishedTutors(false)
      setLoading(false)
    }
  }, [childrenTeen, finishedChildren, finishedTutors, tutors])

  useEffect(() => {
    let resultsFromTutor = {}
    tutors.forEach(async (objeto) => {
      resultsFromTutor = await getResults(objeto?.tutor.user)
      objeto.resultsQuestion = resultsFromTutor
    })
  }, [tutors])

  useEffect(async () => {
    if (personChoosed) {
      setIsLoadingQuestionaryPerson(true)
      const resultsFromApi = await getResults(personChoosed.idUser)
      const answersPerson = resultsFromApi?.map((object) => {
        let count = 0
        if (object.child?.id === personChoosed.id) {
          count = object.id
        }else
        if (object?.exam.id === (9 || 12 || 20 || 24) && personChoosed.nameChild === 'Familia') {
          count = object.id
        }
        return count
      })
      console.log('Respostas do person choosed ======>', answersPerson)
      setLengthListOfResults(answersPerson)
    }
  }, [personChoosed])

  useEffect(() => {
    setLoadingAnswer(loading)
  }, [loading])

  useEffect(() => {
    if (personChoosed) {
      if (lengthListOfResults.length !== 0) {
        const values = lengthListOfResults.filter((number) => number !== 0)
        let answers = []
        values.forEach((number) => {
          getQuestionario(number).then((res) => {
            answers.push(res)
          })
        })

        setTimeout(() => {
          setListOfResults(answers)
        }, 4000)
      } else {
        setListOfResults([])
      }

      setTimeout(() => {
        setIsLoadingQuestionaryPerson(false)
        setIsOpenQuestionaryModal(true)
      }, 4000)

      localStorage.setItem('person', JSON.stringify(personChoosed))
      localStorage.setItem('questionaries', JSON.stringify(listOfResults))

      window.open('/user-info-questionary')
    }
    setPersonChoosed(0)
  }, [lengthListOfResults])

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

  const handleAgeRange = (ageRange) => {
    switch (ageRange) {
      case 'six_to_twelve':
      case 'children':
        return 'Criança'
      case 'teenagers':
        return 'Adolescente'
      default:
        return 'Familia'
    }
  }

  const handleCreateHeaderTable = () => {
    return (
      <>
        <tr>
          <th key={'nome'} className="cabecalho">
            Nome do Tutor
          </th>
          <th key={'crianca'} className="cabecalho">
            Nome da Criança/Adolescente
          </th>
          <th key={'faixaEtaria'}>Faixa Etaria</th>
          <th key={'questComplete'}>Porcentagem de Respostas</th>
          <th key={'respostasQuest'}>Respostas do Questionario</th>
        </tr>
      </>
    )
  }

  const handlePercentage = (resultsFromTutor, childAgeRange, idChild) => {
    console.log('Results =========>', resultsFromTutor)
    if (childAgeRange === 'children' || childAgeRange === 'six_to_twelve') {
      const values = []
      resultsFromTutor?.map((result) => {
        if (idChild === result?.child?.id) {
          if (!values.includes(result?.exam.id)) {
            values.push(result?.exam.id)
          }
        }
      })
      let counter = 0
      if (values.includes(14)) {
        counter += 1
      }
      if (values.includes(15)) {
        counter += 1
      }
      if (values.includes(17)) {
        counter += 1
      }
      return `${(counter / 3) * 100}%`
    } else if (childAgeRange === 'teenagers') {
      const values = []
      resultsFromTutor?.map((result) => {
        if (idChild === result?.child?.id) {
          if (!values.includes(result?.exam.id)) {
            values.push(result?.exam.id)
          }
        }
      })
      let counter = 0
      if (values.includes(18)) {
        counter += 1
      }
      if (values.includes(16)) {
        counter += 1
      }
      if (values.includes(19)) {
        counter += 1
      }
      if (values.includes(22)) {
        counter += 1
      }
      if (values.includes(21)) {
        counter += 1
      }
      return `${(counter / 5) * 100}%`
    } else {
      const values = []
      resultsFromTutor?.map((result) => {
        if (!values.includes(result?.exam.id)) {
          values.push(result?.exam.id)
        }
      })
      let counter = 0
      if (values.includes(9)) {
        counter += 1
      }
      if (values.includes(12)) {
        counter += 1
      }
      if (values.includes(20)) {
        counter += 1
      }
      if (values.includes(24)) {
        counter += 1
      }
      return `${(counter / 4) * 100}%`
    }
  }

  const handleCreateTheTable = () => {
    return tutors.map((objeto) => {
      return objeto.children.map((child) => {
        return (
          <tr key={`${objeto.tutor.id}${child?.id}`}>
            <td class="lineTable">
              <Tooltip content={`Telefone: ${objeto.tutor?.phone}`} direction="right">
                {objeto.tutor.name}
              </Tooltip>
            </td>
            <td class="lineTable">{child.name}</td>
            <td class="lineTable">{handleAgeRange(child?.age_range)}</td>
            <td class="lineTable">
              {handlePercentage(objeto?.resultsQuestion, child?.age_range, child?.id)}
            </td>
            <td class="lineTable">
              <button
                id={`${child?.id}`}
                onClick={(event) => {
                  setPersonChoosed({
                    nameChild: child.name,
                    nameTutor: objeto.tutor.name,
                    idUser: objeto.tutor.user,
                    id: child?.id
                  })
                  console.log('event', event.target)
                }}
                className="close-button"
              >
                Abrir Questionarios
              </button>
            </td>
          </tr>
        )
      })
    })
  }

  // const handleQuantityQuestion = async (idExam) => {
  //   let value = await getQuestionario(idExam)
  //   console.log('This is handleQuantity')
  //   const valueFinded = exams.find(exam => exam.numberId === value?.exam?.id)
  //   return `${value?.result_answers?.length}/${valueFinded.sizeQuestions}`
  // }

  // const sortTable = (n) => {
  //   console.log('sortTable sortTable')
  //   setIsOpenLoadingOrderModal(true)
  //   var table,
  //     rows,
  //     switching,
  //     i,
  //     x,
  //     y,
  //     shouldSwitch,
  //     dir,
  //     switchcount = 0
  //   table = document.getElementById('child_teen')
  //   switching = true
  //   dir = 'asc'
  //   while (switching) {
  //     switching = false
  //     rows = table.getElementsByTagName('TR')
  //     for (i = 1; i < rows.length - 1; i++) {
  //       shouldSwitch = false
  //       x = rows[i].getElementsByTagName('TD')[n]
  //       y = rows[i + 1].getElementsByTagName('TD')[n]
  //       let cmpX = isNaN(parseInt(x.innerHTML)) ? x.innerHTML.toLowerCase() : parseInt(x.innerHTML)
  //       let cmpY = isNaN(parseInt(y.innerHTML)) ? y.innerHTML.toLowerCase() : parseInt(y.innerHTML)
  //       if (dir === 'asc') {
  //         if (cmpX > cmpY) {
  //           shouldSwitch = true
  //           break
  //         }
  //       } else if (dir === 'desc') {
  //         if (cmpX < cmpY) {
  //           shouldSwitch = true
  //           break
  //         }
  //       }
  //     }
  //     if (shouldSwitch) {
  //       rows[i].parentNode.insertBefore(rows[i + 1], rows[i])
  //       switching = true
  //       switchcount++
  //     } else {
  //       if (switchcount === 0 && dir === 'asc') {
  //         dir = 'desc'
  //         switching = true
  //       }
  //     }
  //   }
  //   setIsOpenLoadingOrderModal(false)
  // }

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
      {/* {isOpenQuestionaryModal && (
        <>
          <div class="overlay" />
          <div class="modalTableInfo">
            <UserInfo person={personChoosed} questionaries={listOfResults} />
          </div>
        </>
      )} */}
    </div>
  )
}

export default TableInfo
