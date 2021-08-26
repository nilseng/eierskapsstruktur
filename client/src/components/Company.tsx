import React, { useEffect, useState } from "react";
import { useContext } from "react";
import Button from "react-bootstrap/esm/Button";
import Container from "react-bootstrap/esm/Container";
import Table from "react-bootstrap/esm/Table";
import { useHistory } from "react-router";
import { AppContext } from "../App";
import { useQuery } from "../hooks";
import { IOwnership, IShareholder } from "../models/models";

export const Company = () => {
  const { theme } = useContext(AppContext);

  const query = useQuery();
  const history = useHistory();
  const [error, setError] = useState<string>();

  const [companyId, setCompanyId] = useState<string>();
  const [orgnr, setOrgnr] = useState<string>();
  const [company, setCompany] = useState<IShareholder>();
  const [ownerships, setOwnerships] = useState<IOwnership[]>([]);

  useEffect(() => {
    const _id = query.get("_id");
    const o = query.get("orgnr");
    setCompanyId(_id ?? undefined);
    setOrgnr(o ?? undefined);
  }, [query]);

  useEffect(() => {
    if (companyId) {
      fetch(`/api/company?_id=${companyId}`).then(async (res) => {
        const c = await res.json();
        setCompany(c);
      });
    } else if (orgnr) {
      fetch(`/api/company?orgnr=${orgnr}`).then(async (res) => {
        const c = await res.json();
        setCompany(c);
      });
    }
  }, [companyId, orgnr]);

  useEffect(() => {
    if (company) {
      fetch(`/api/ownerships?orgnr=${company.orgnr}`).then(async (res) => {
        const o = await res.json();
        if (o?.error) {
          setError(o.error);
          setOwnerships([]);
        } else setOwnerships(o);
      });
    }
  }, [company]);

  return (
    <>
      <Container style={{ color: theme.text }}>
        <p className="my-4">Aksjonærer i {company?.name}</p>
        {ownerships && ownerships.filter((o) => o.year === 2020).length > 0 && (
          <>
            <p>2020</p>
            <Table variant={theme.id} striped hover responsive>
              <thead>
                <tr>
                  <th>Aksjonær</th>
                  <th>Landkode</th>
                  <th>Antall aksjer</th>
                  <th>Eierandel</th>
                </tr>
              </thead>
              <tbody>
                {ownerships &&
                  ownerships
                    .filter((o) => o.year === 2020)
                    .map((o) => (
                      <tr key={o._id}>
                        <td className="d-flex align-items-center justify-content-between">
                          <span
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              history.push(
                                `/shareholder?_id=${o.shareholder?._id}`
                              )
                            }
                          >
                            {o.shareholder?.name}
                          </span>
                          {o.shareholder?.orgnr &&
                            (o.shareholder.name.includes(" AS") ||
                              o.shareholder.name
                                .toLowerCase()
                                .includes("aksjeselskap")) && (
                              <Button
                                size="sm"
                                className="float-right"
                                onClick={() =>
                                  history.push(
                                    `/company?orgnr=${o.shareholder?.orgnr}`
                                  )
                                }
                              >
                                {"Aksjonærer".toUpperCase()}
                              </Button>
                            )}
                        </td>
                        <td>{o.shareholder?.countryCode}</td>
                        <td>{o.stocks.toLocaleString()}</td>
                        <td>
                          {company?.stocks &&
                            ((o.stocks / company.stocks) * 100).toFixed(2)}
                          %
                        </td>
                      </tr>
                    ))}
              </tbody>
            </Table>
          </>
        )}
        {ownerships && ownerships.filter((o) => o.year === 2019).length > 0 && (
          <>
            <p>2019</p>
            <Table variant={theme.id} striped hover responsive>
              <thead>
                <tr>
                  <th>Aksjonær</th>
                  <th>Landkode</th>
                  <th>Antall aksjer</th>
                  <th>Eierandel</th>
                </tr>
              </thead>
              <tbody>
                {ownerships &&
                  ownerships
                    .filter((o) => o.year === 2019)
                    .map((o) => (
                      <tr key={o._id}>
                        <td className="d-flex align-items-center justify-content-between">
                          <span
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              history.push(
                                `/shareholder?_id=${o.shareholder?._id}`
                              )
                            }
                          >
                            {o.shareholder?.name}
                          </span>
                          {o.shareholder?.orgnr &&
                            (o.shareholder.name.includes(" AS") ||
                              o.shareholder.name
                                .toLowerCase()
                                .includes("aksjeselskap")) && (
                              <Button
                                size="sm"
                                className="float-right"
                                onClick={() =>
                                  history.push(
                                    `/company?orgnr=${o.shareholder?.orgnr}`
                                  )
                                }
                              >
                                {"Aksjonærer".toUpperCase()}
                              </Button>
                            )}
                        </td>
                        <td>{o.shareholder?.countryCode}</td>
                        <td>{o.stocks.toLocaleString()}</td>
                        <td>
                          {company?.stocks &&
                            ((o.stocks / company.stocks) * 100).toFixed(2)}
                          %
                        </td>
                      </tr>
                    ))}
              </tbody>
            </Table>
          </>
        )}
        {(!ownerships || ownerships.length === 0) && !error && companyId && (
          <p>Laster inn aksjonærdata...</p>
        )}
        {error && <p>Åh, nei! Noe ser ut til å ha gått galt..:/</p>}
      </Container>
    </>
  );
};