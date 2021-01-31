import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Alert from '@material-ui/lab/Alert';
import TextField from '@material-ui/core/TextField';
import LogOutButton from '../css/logout';
import {
  QuizCard, QuizTitle, Button, CreateGameButton, Modal, ModalContent, CloseButton,
} from '../css/quizCard';
import { ModalForm, BlueInput } from '../css/forms';
import Header from '../css/pageLayout';

const Dashboard = () => {
  // initialise variables
  const [alertMsg, setAlertMsg] = useState('');
  const [alertState, setAlertState] = useState('none');
  const [successMsg, setSuccessMsg] = useState('');
  const [successState, setSuccessState] = useState('none');
  const [quizList, setQuizList] = useState([]);
  const [quizzesReady, setQuizzesReady] = useState(false);
  const [newGameName, setNewGameName] = useState('');
  const [modalState, setModalState] = useState('none');

  // navigate back to sign in
  const history = useHistory();
  const navigateToSignIn = () => {
    const path = '/';
    history.push(path);
  };

  // navigate to edit a specific game
  const directToEditGame = (quiz) => {
    const path = `/editgame/:${quiz.id}`;
    history.push(path);
  };
  // api call to fetch all quizzes made by the user
  const apiCall = () => {
    const getQuizOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
    };
    fetch('http://localhost:5005/admin/quiz', getQuizOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        return Promise.reject(response.json());
      })
      .then((json) => {
        const listOfQuizzes = [];
        json.quizzes.forEach(async (quiz) => {
          await fetch(`http://localhost:5005/admin/quiz/${quiz.id}`, getQuizOptions)
            .then((response) => {
              if (response.ok) {
                return response.json();
              }
              return Promise.reject(response.json());
            })
            .then((quizResponse) => {
              const result = quizResponse;
              result.id = quiz.id;
              listOfQuizzes.push(result);
            })
            .catch((error) => {
              Promise.resolve(error)
                .then((e) => {
                  setAlertMsg(e.error);
                  setAlertState('flex');
                });
            });
        });
        setQuizList(listOfQuizzes);
      })
      .catch((error) => {
        Promise.resolve(error)
          .then((e) => {
            setAlertMsg(e.error);
            setAlertState('flex');
          });
      });
  };
  // if user is accessing this route without logging in, redirect
  useEffect(() => {
    if (localStorage.getItem('token') === null) {
      setAlertMsg('Why are you here. Sign In First! Redirecting in 3 seconds...');
      setAlertState('flex');
      setTimeout(() => {
        navigateToSignIn();
      }, 3000);
    } else { // otherwise render the user's quiz dashboard
      apiCall();
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

  useEffect(() => {
    setTimeout(() => {
      if (quizList.length > 0) {
        setQuizzesReady(true);
      }
    }, 500);
  }, [quizList]);

  // create new game
  const createNewGame = async (event) => {
    event.preventDefault();
    const newGameOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ name: newGameName }),
    };
    await fetch('http://localhost:5005/admin/quiz/new', newGameOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        return Promise.reject(response.json());
      })
      .then(() => {
        setSuccessState('flex');
        setSuccessMsg('Created new game!');
        setModalState('none');
        setTimeout(() => {
          setSuccessState('none');
        }, 1000);
      })
      .catch((error) => {
        Promise.resolve(error)
          .then((e) => {
            setAlertMsg(e.error);
            setAlertState('flex');
          });
      });
    apiCall();
  };

  // delete quiz
  const deleteQuiz = async (quiz) => {
    const deleteGameOptions = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    };
    await fetch(`http://localhost:5005/admin/quiz/${quiz.id}`, deleteGameOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        return Promise.reject(response.json());
      })
      .then(() => {
        setSuccessState('flex');
        setSuccessMsg('Delete Success!');
        setTimeout(() => {
          setSuccessState('none');
        }, 1000);
      })
      .catch((error) => {
        Promise.resolve(error)
          .then((e) => {
            setAlertMsg(e.error);
            setAlertState('flex');
          });
      });
    apiCall();
  };

  // calculate the total time required to complete quiz
  const calculateTime = (questions) => {
    let time = 0;
    for (let i = 0; i < questions.length; i += 1) {
      time += parseInt(questions[i].timeAllowed, 10);
    }
    return time;
  };
  return (
    <div>
      <Alert variant="outlined" severity="error" style={{ display: alertState }} onClose={() => { setAlertState('none'); }}>{alertMsg}</Alert>
      <Alert variant="outlined" severity="success" style={{ display: successState }} onClose={() => { setSuccessState('none'); }}>{successMsg}</Alert>
      <Header>
        <CreateGameButton aria-label="create new game" onClick={() => { setModalState('block'); }}>Create New Game</CreateGameButton>
        <LogOutButton aria-label="log out user" onClick={signOut}>Log Out</LogOutButton>
      </Header>
      <Modal className="modal" style={{ display: modalState }}>
        <ModalContent className="modal-content">
          <CloseButton aria-label="close create game modal" onClick={() => { setModalState('none'); }}>&times;</CloseButton>
          <ModalForm onSubmit={createNewGame}>
            <TextField variant="outlined" label="Name of new game" required="true" type="text" value={newGameName} onChange={(e) => setNewGameName(e.target.value)} />
            <br />
            <BlueInput type="submit" value="Create" aria-label="create new game submittion" />
          </ModalForm>
        </ModalContent>
      </Modal>
      <h1>Quiz Dashboard</h1>
      {quizzesReady && quizList.map((data) => (
        <QuizCard key={data.id}>
          {data.thumbnail && <img src={data.thumbnail} alt={`thumbnail for the quiz ${data.name}`} /> }
          <div>
            <QuizTitle>
              {data.name}
            </QuizTitle>
            <p>
              {data.questions.length}
              {' '}
              Questions
            </p>
            <p>
              Time to complete quiz:
              {' '}
              {calculateTime(data.questions)}
              {' seconds'}
            </p>
          </div>
          <div>
            <Button aria-label="edit quiz" onClick={() => directToEditGame(data)}>Edit Quiz</Button>
            <Button aria-label="delete question" onClick={() => deleteQuiz(data)}>Delete Quiz</Button>
          </div>
        </QuizCard>
      ))}
    </div>
  );
};

export default Dashboard;
