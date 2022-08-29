import React, { useContext } from 'react'

import { AuthContext } from '../../contexts/auth'

import './styles.css'

const UserInfo = ({ person, questionaries }) => {
  const { setIsOpenQuestionaryModal } = useContext(AuthContext)
  return questionaries.length !== 0 ? (
    <>
      <button class="buttonModalInfo" onClick={() => setIsOpenQuestionaryModal(false)}>
        Fechar
      </button>
      <div class="containerUserInfo">
        <h1 class="nameOfPerson">
          Nome:
          {person?.nameChild === 'Familia'
            ? ` ${person?.nameChild} de ${person?.nameTutor}`
            : ` ${person?.nameChild}`}
        </h1>
        {questionaries.map((questionary) => {
          return (
            <div class="containerQuestionaries">
              <table>
                <thead>
                  <tr class="cabecalho">
                    <td colSpan="2">
                      <h2 class="titleOfQuestionary">{questionary.exam.description}: </h2>
                    </td>
                  </tr>
                  <tr>
                    <td key={'question'} class="cabecalho">
                      Pergunta
                    </td>
                    <td key={'answer'} class="cabecalho">
                      Resposta
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {questionary.result_answers.map((quest) => {
                    return (
                      <tr>
                        <td class="cellOfTable">{quest.question?.title}</td>
                        <td class="cellOfTable">{quest.answer?.title || quest.answer}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )
        })}
      </div>
    </>
  ) : (
    <div class="containerUserNoInfo">
      <h1 class="nameOfPerson">
        {person?.nameChild === 'Familia' ? `${person?.nameTutor}` : `${person?.nameChild}`} não tem registro de nenhuma resposta de qualquer questionário
      </h1>
      <button class="buttonModalNoInfo" onClick={() => setIsOpenQuestionaryModal(false)}>
        Fechar
      </button>
    </div>
  )
}

export default UserInfo
