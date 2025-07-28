import React from 'react';
import { usePeopleContext } from '../context/PeopleContext';
import { Link, useParams } from 'react-router-dom';
import { Loader } from './Loader';

type PersonSlug = {
  isSlug: boolean;
  slugPerson?: string;
};

export const Peoples: React.FC = () => {
  const { peoples, isLoading, peopleLoadingError } = usePeopleContext();
  const { slug } = useParams();
  const currentPersonSlug = slug;

  const findPerson = (personName: string): PersonSlug => {
    if (!peoples || !personName) {
      return { isSlug: false };
    }

    const foundPerson = peoples.find(
      person => person.name === personName && !!person.slug,
    );

    if (foundPerson && foundPerson.slug) {
      return {
        isSlug: true,
        slugPerson: foundPerson.slug,
      };
    }

    return { isSlug: false };
  };

  return (
    <main className="section">
      <div className="container">
        <h1 className="title">People Page</h1>
        <div className="block">
          <div className="box table-container">
            {peopleLoadingError && (
              <p data-cy="peopleLoadingError" className="has-text-danger">
                {peopleLoadingError}
              </p>
            )}

            {peoples?.length === 0 ? (
              <p data-cy="noPeopleMessage">There are no people on the server</p>
            ) : (
              <>
                {isLoading ? (
                  <Loader />
                ) : (
                  <table
                    data-cy="peopleTable"
                    className="table
                  is-striped
                  is-hoverable
                  is-narrow
                  is-fullwidth"
                  >
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Sex</th>
                        <th>Born</th>
                        <th>Died</th>
                        <th>Mother</th>
                        <th>Father</th>
                      </tr>
                    </thead>

                    <tbody>
                      {peoples?.map(person => {
                        let motherHaveSlug = false;
                        let motherSlug: string | undefined;
                        let fatherHaveSlug = false;
                        let fatherSlug: string | undefined;

                        if (person.motherName !== null) {
                          const { isSlug, slugPerson } = findPerson(
                            person.motherName,
                          );

                          motherHaveSlug = isSlug;
                          motherSlug = slugPerson;
                        }

                        if (person.fatherName !== null) {
                          const { isSlug, slugPerson } = findPerson(
                            person.fatherName,
                          );

                          fatherHaveSlug = isSlug;
                          fatherSlug = slugPerson;
                        }

                        return (
                          <tr
                            key={person.name}
                            data-cy="person"
                            className={`${currentPersonSlug === person.slug ? 'has-background-warning' : ''}`}
                          >
                            <td>
                              <Link
                                to={`/people/${person.slug}`}
                                className={`${person.sex === 'f' ? 'has-text-danger' : ''}`}
                              >
                                {person.name}
                              </Link>
                            </td>

                            <td>{person.sex}</td>
                            <td>{person.born}</td>
                            <td>{person.died}</td>
                            <td>
                              {person.motherName === null ? (
                                '-'
                              ) : motherHaveSlug ? (
                                <Link
                                  to={`/people/${motherSlug}`}
                                  className="has-text-danger"
                                >
                                  {person.motherName}
                                </Link>
                              ) : (
                                person.motherName
                              )}
                            </td>
                            <td>
                              {person.fatherName === null ? (
                                '-'
                              ) : fatherHaveSlug ? (
                                <Link to={`/people/${fatherSlug}`}>
                                  {person.fatherName}
                                </Link>
                              ) : (
                                person.fatherName
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
