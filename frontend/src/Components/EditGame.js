import React, { useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Alert from '@material-ui/lab/Alert';
import Checkbox from '@material-ui/core/Checkbox';
import { ModalForm, SubmitButton, PurpleInput } from '../css/forms';
import {
  Modal, ModalContent, QuizCard, QuizTitle, Button, EditArea, CloseButton,
  AnswerField,
} from '../css/quizCard';
import LogOutButton from '../css/logout';
import Header from '../css/pageLayout';

const EditGame = () => {
  // initialise variable and states
  const location = useLocation();
  const gameId = location.pathname.split('/:')[1];

  const [modalState, setModalState] = useState('none');
  const [alertMsg, setAlertMsg] = useState('');
  const [alertState, setAlertState] = useState('none');
  const [successState, setSuccessState] = useState('none');

  const [quizName, setName] = useState('');
  const [quizThumbnail, setThumbnail] = useState('');
  const [questionsList, setQuestions] = useState([]);

  const [newQName, setNewQName] = useState('');
  const [answer1, setAnswer1] = useState('');
  const [answer2, setAnswer2] = useState('');
  const [answer3, setAnswer3] = useState('');
  const [answer4, setAnswer4] = useState('');
  const [answer5, setAnswer5] = useState('');
  const [answer6, setAnswer6] = useState('');
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(false);
  const [checked3, setChecked3] = useState(false);
  const [checked4, setChecked4] = useState(false);
  const [checked5, setChecked5] = useState(false);
  const [checked6, setChecked6] = useState(false);
  const [time, setTime] = useState(10);
  const [points, setPoints] = useState(1);
  const [status, setStatus] = useState('');
  const [index, setIndex] = useState(null);

  // navigate back to sign in
  const history = useHistory();
  const navigateToSignIn = () => {
    const path = '/';
    history.push(path);
  };
  // navigate to dashboard
  const navigateToDashboard = () => {
    const path = '/dashboard';
    history.push(path);
  };

  // redirects user/ fetches information on specific quiz
  useEffect(() => {
    // if user is not logged in, they are not allowed to access this page, redirect
    if (localStorage.getItem('token') === null) {
      setAlertMsg('Why are you here. Sign In First! Redirecting in 3 seconds...');
      setAlertState('flex');
      setTimeout(() => {
        navigateToSignIn();
      }, 3000);
    } else {
      const getQuizOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
      };
      fetch(`http://localhost:5005/admin/quiz/${gameId}`, getQuizOptions)
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          return Promise.reject(response.json());
        })
        .then((quizResponse) => {
          setName(quizResponse.name);
          setThumbnail(quizResponse.thumbnail);
          setQuestions(quizResponse.questions);
        })
        .catch((error) => {
          Promise.resolve(error)
            .then((e) => {
              setAlertMsg(e.error);
              setAlertState('flex');
            });
        });
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // sign out attempt
  const signOut = async () => {
    const signOutOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
    };
    await fetch('http://localhost:5005/admin/auth/logout', signOutOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        return Promise.reject(response.json());
      })
      .then(() => {
        navigateToSignIn();
        localStorage.removeItem('token');
      })
      .catch((error) => {
        Promise.resolve(error)
          .then((e) => {
            setAlertMsg(e.error);
            setAlertState('flex');
          });
      });
  };

  // open up the modal to add a question
  const addQuestion = (event) => {
    event.preventDefault();
    setStatus('Add');
    setModalState('block');
  };

  // reset the textfields within the modal
  const resetState = () => {
    setModalState('none');
    setNewQName('');
    setAnswer1('');
    setAnswer2('');
    setAnswer3('');
    setAnswer4('');
    setAnswer5('');
    setAnswer6('');
    setChecked1(false);
    setChecked2(false);
    setChecked3(false);
    setChecked4(false);
    setChecked5(false);
    setChecked6(false);
    setTime(10);
    setPoints(1);
  };

  // set the text fields when editing an existing question
  const editQuestion = (questionIndex) => {
    setModalState('block');
    setStatus('Edit');
    setNewQName(questionsList[questionIndex].name);
    setAnswer1(questionsList[questionIndex].answers[0]);
    setAnswer2(questionsList[questionIndex].answers[1]);
    setAnswer3(questionsList[questionIndex].answers[2] ? questionsList[questionIndex].answers[2] : '');
    setAnswer4(questionsList[questionIndex].answers[3] ? questionsList[questionIndex].answers[3] : '');
    setAnswer5(questionsList[questionIndex].answers[4] ? questionsList[questionIndex].answers[4] : '');
    setAnswer6(questionsList[questionIndex].answers[5] ? questionsList[questionIndex].answers[5] : '');
    setChecked1(questionsList[questionIndex].correctAnswers
      .includes(questionsList[questionIndex].answers[0]));
    setChecked2(questionsList[questionIndex].correctAnswers
      .includes(questionsList[questionIndex].answers[1]));
    setChecked3(questionsList[questionIndex].correctAnswers
      .includes(questionsList[questionIndex].answers[2]));
    setChecked4(questionsList[questionIndex].correctAnswers
      .includes(questionsList[questionIndex].answers[3]));
    setChecked5(questionsList[questionIndex].correctAnswers
      .includes(questionsList[questionIndex].answers[4]));
    setChecked6(questionsList[questionIndex].correctAnswers
      .includes(questionsList[questionIndex].answers[5]));
    setTime(questionsList[questionIndex].timeAllowed);
    setPoints(questionsList[questionIndex].pointsAllocated);
    setIndex(questionIndex);
  };

  // create the structure for the question and set it
  const submitQuestion = (event) => {
    event.preventDefault();
    const question = {
      name: newQName,
      timeAllowed: time,
      pointsAllocated: points,
      answers: [
        answer1,
        answer2,
        answer3.length !== 0 && answer3,
        answer4.length !== 0 && answer4,
        answer5.length !== 0 && answer5,
        answer6.length !== 0 && answer6,
      ],
      correctAnswers: [
        checked1 && answer1 ? answer1 : null,
        checked2 && answer2 ? answer2 : null,
        checked3 && answer3 ? answer3 : null,
        checked4 && answer4 ? answer4 : null,
        checked5 && answer5 ? answer5 : null,
        checked6 && answer6 ? answer6 : null,
      ],
    };
    if (status === 'Add') {
      setQuestions([...questionsList, question]);
    } else {
      const newList = questionsList;
      newList[index] = question;
      setQuestions(newList);
    }
    resetState();
  };

  // api call to submit question edit
  const submitEdit = async () => {
    const editGameOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        questions: questionsList,
        name: quizName,
        thumbnail: quizThumbnail,
      }),
    };
    await fetch(`http://localhost:5005/admin/quiz/${gameId}`, editGameOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        return Promise.reject(response.json());
      })
      .then(() => {
        setSuccessState('flex');
      })
      .catch((error) => {
        Promise.resolve(error)
          .then((e) => {
            setAlertMsg(e.error);
            setAlertState('flex');
          });
      });
  };
  return (
    <div>
      <Alert variant="outlined" severity="success" style={{ display: successState }} onClose={() => { setSuccessState('none'); }}>Edit Success!</Alert>
      <Alert variant="outlined" severity="error" style={{ display: alertState }} onClose={() => { setAlertState('none'); }}>{alertMsg}</Alert>
      <Header>
        <Button aria-label="navigate to dashboard" onClick={navigateToDashboard}>Back to Dashboard</Button>
        <LogOutButton aria-label="log out user" onClick={signOut}>Log Out</LogOutButton>
      </Header>
      <h1>Edit Quiz</h1>
      <EditArea>
        <TextField variant="outlined" label="Quiz name" required="true" type="text" value={quizName} onChange={(e) => setName(e.target.value)}>{quizName}</TextField>
        <br />
        <TextField variant="outlined" label="Quiz thumbnail" type="text" value={quizThumbnail} onChange={(e) => setThumbnail(e.target.value)}>{quizThumbnail}</TextField>
      </EditArea>

      <h1>Questions</h1>
      <Button aria-label="add a question" style={{ margin: '20px' }} onClick={(e) => addQuestion(e)}>Add Question</Button>
      <Modal className="modal" style={{ display: modalState }}>
        <ModalContent className="modal-content">
          <CloseButton aria-label="close modal" onClick={resetState}>&times;</CloseButton>
          <ModalForm onSubmit={submitQuestion}>
            <TextField variant="outlined" label="Question name" required="true" type="text" value={newQName} onChange={(e) => setNewQName(e.target.value)} />
            <br />
            <TextField variant="outlined" label="Time allowed" required="true" type="text" value={time} onChange={(e) => setTime(e.target.value)}>{time}</TextField>
            <br />
            <TextField variant="outlined" label="Points allocated" required="true" type="text" value={points} onChange={(e) => setPoints(e.target.value)}>{points}</TextField>
            <br />
            <p>Select the correct answer(s)</p>
            <AnswerField>
              <TextField variant="outlined" label="Answer 1" required="true" type="text" value={answer1} onChange={(e) => setAnswer1(e.target.value)} />
              <Checkbox checked={checked1} onChange={() => setChecked1(!checked1)} />
            </AnswerField>
            <br />
            <AnswerField>
              <TextField variant="outlined" label="Answer 2" required="true" type="text" value={answer2} onChange={(e) => setAnswer2(e.target.value)} />
              <Checkbox checked={checked2} onChange={() => setChecked2(!checked2)} />
            </AnswerField>
            <br />
            <AnswerField>
              <TextField variant="outlined" label="Answer 3" type="text" value={answer3} onChange={(e) => setAnswer3(e.target.value)} />
              <Checkbox
                checked={checked3}
                disabled={answer3.length === 0}
                onChange={() => setChecked3(!checked3)}
              />
            </AnswerField>
            <br />
            <AnswerField>
              <TextField variant="outlined" label="Answer 4" type="text" value={answer4} onChange={(e) => setAnswer4(e.target.value)} />
              <Checkbox
                checked={checked4}
                disabled={answer4.length === 0}
                onChange={() => setChecked4(!checked4)}
              />
            </AnswerField>
            <br />
            <AnswerField>
              <TextField variant="outlined" label="Answer 5" type="text" value={answer5} onChange={(e) => setAnswer5(e.target.value)} />
              <Checkbox
                checked={checked5}
                disabled={answer5.length === 0}
                onChange={() => setChecked5(!checked5)}
              />
            </AnswerField>
            <br />
            <AnswerField>
              <TextField variant="outlined" label="Answer 6" type="text" value={answer6} onChange={(e) => setAnswer6(e.target.value)} />
              <Checkbox
                checked={checked6}
                disabled={answer6.length === 0}
                onChange={() => setChecked6(!checked6)}
              />
            </AnswerField>
            <br />
            <PurpleInput type="submit" value={status === 'Add' ? 'Add Question' : 'Edit Question'} aria-label="add question to quiz submittion" />
          </ModalForm>
        </ModalContent>
      </Modal>
      {questionsList.map((data) => (
        <QuizCard key={data.id}>
          <QuizTitle>
            {data.name}
          </QuizTitle>
          <p style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center', fontStyle: 'italic',
          }}
          >
            Question
            {' '}
            {questionsList.indexOf(data) + 1}
          </p>
          <div>
            <Button aria-label="edit question" onClick={() => editQuestion(questionsList.indexOf(data))}>Edit Question</Button>
            <Button
              aria-label="delete question"
              onClick={() => setQuestions(questionsList.filter((q) => q !== data))}
            >
              Delete Question
            </Button>
          </div>
        </QuizCard>
      ))}
      <SubmitButton onClick={submitEdit}>Complete Edit</SubmitButton>
    </div>
  );
};

export default EditGame;
