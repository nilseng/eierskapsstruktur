import { useEffect, useState } from "react";
import { ICompany, IOwnership, IShareholder } from "../models/models";

export const getCompany = async (id: string) => {
    const res = await fetch(`/api/company?_id=${id}`)
    return res.json()
}

export const getCompanyByOrgnr = async (orgnr: string) => {
    const res = await fetch(`/api/company?orgnr=${orgnr}`)
    return res.json()
}

export const getCompanies = async (searchTerm?: string, limit?: number) => {
    const res = await fetch(searchTerm ? `/api/company/${searchTerm}?limit=${limit}` : `/api/companies?limit=${limit}`)
    return res.json()
}

export const getCompanyCount = async (searchTerm?: string) => {
    const res = await fetch(searchTerm ? `/api/company/${searchTerm}?count=true` : "/api/company?count=true")
    return res.json()
}

export const getShareholder = async (_id?: string, shareholderId?: string) => {
    if (_id) {
        const res = await fetch(`/api/shareholder?_id=${_id}`)
        return res.json()
    } else if (shareholderId) {
        const res = await fetch(`/api/shareholder?shareholderId=${shareholderId}`)
        return res.json()
    } else {
        return new Promise(() => undefined)
    }
}

export const getShareholders = async (limit?: number) => {
    const res = await fetch(`/api/shareholders?limit=${limit}`)
    return res.json()
}

export const getShareholderCount = async () => {
    const res = await fetch("/api/shareholder?count=true")
    return res.json()
}

export const getOwnerships = async (year?: number, limit?: number) => {
    const res = await fetch(`/api/ownerships?limit=${limit}&year=${year}`)
    return res.json()
}

export const getOwnerOwnerships = async (company?: ICompany, shareholder?: IShareholder) => {
    if (company) {
        const res = await fetch(`/api/ownerships?orgnr=${company.orgnr}`)
        return res.json()
    }
    else if (shareholder?.orgnr) {
        const res = await fetch(`/api/ownerships?orgnr=${shareholder.orgnr}`)
        return res.json()
    }
}

export const getOwneeOwnerships = async (company?: ICompany, shareholder?: IShareholder) => {
    if (company) {
        const res = await fetch(`/api/ownerships?shareholderOrgnr=${company.orgnr}`)
        return res.json()
    }
    else if (shareholder) {
        const res = await fetch(`/api/ownerships?shareholderId=${shareholder.id}`)
        return res.json()
    }
}

export const getOwnershipCount = async (company: ICompany, year: number) => {
    const res = await fetch(`/api/ownerships?orgnr=${company.orgnr}&year=${year}&count=true`)
    return res.json()
}

export const getCompanyGraph = async (year: number, limit?: number):
    Promise<{ ownerships: IOwnership[], nodes: { [key: string]: Partial<ICompany & IShareholder> } }> => {
    const res = await fetch(`/api/company-graph?year=${year}&limit=${limit}`)
    return res.json()
}

export const useShareholderCount = () => {
    const [count, setCount] = useState<number>()

    useEffect(() => {
        getShareholderCount().then(res => setCount(res))
    }, [setCount])

    return count
}

export const useCompanyCount = (searchTerm?: string) => {
    const [count, setCount] = useState<number>()

    useEffect(() => {
        getCompanyCount(searchTerm).then(res => setCount(res))
    }, [setCount, searchTerm])

    return count
}

export const useGetOwnerOwnerships = (company?: ICompany, shareholder?: IShareholder) => {
    const [ownerOwnerships, setOwnerOwnerships] = useState<IOwnership[]>()
    useEffect(() => {
        if (company) {
            getOwnerOwnerships(company).then((o) => {
                if (o?.error) {
                    setOwnerOwnerships([]);
                } else setOwnerOwnerships(o);
            });
        }
        else if (shareholder) {
            getOwnerOwnerships(undefined, shareholder).then((o) => {
                if (o?.error) {
                    setOwnerOwnerships([]);
                } else setOwnerOwnerships(o);
            });
        }
        return () => setOwnerOwnerships(undefined)
    }, [company, shareholder]);
    return { ownerOwnerships, setOwnerOwnerships }
}

export const useGetOwneeOwnerships = (company?: ICompany, shareholder?: IShareholder) => {
    const [owneeOwnerships, setOwneeOwnerships] = useState<IOwnership[]>()
    useEffect(() => {
        if (company) {
            getOwneeOwnerships(company).then(o => {
                if (o?.error) {
                    setOwneeOwnerships([])
                } else setOwneeOwnerships(o)
            })
        } else if (shareholder) {
            getOwneeOwnerships(undefined, shareholder).then(o => {
                if (o?.error) setOwneeOwnerships([])
                else setOwneeOwnerships(o)
            })
        }
        return () => setOwneeOwnerships(undefined)
    }, [company, shareholder])
    return { owneeOwnerships, setOwneeOwnerships }
}

export const useGetCompany = (id?: string, orgnr?: string) => {
    const [company, setCompany] = useState<ICompany>()
    useEffect(() => {
        if (id) {
            getCompany(id).then(c => {
                if (c.error) return;
                setCompany(c)
            })
        } else if (orgnr) {
            getCompanyByOrgnr(orgnr).then(c => {
                if (c.error) return;
                setCompany(c)
            })
        }
    }, [id, orgnr])

    return company
}

export const useCompanies = (searchTerm?: string, limit?: number) => {
    const [companies, setCompanies] = useState<ICompany[]>()
    useEffect(() => {
        getCompanies(searchTerm, limit).then(c => {
            if (c.error) return;
            setCompanies(c)
        })
    }, [searchTerm, limit])
    return companies
}

export const useShareholders = (limit?: number) => {
    const [shareholders, setShareholders] = useState<IShareholder[]>()
    useEffect(() => {
        getShareholders(limit).then(s => {
            if (s.error) return;
            setShareholders(s)
        })
    }, [limit])
    return shareholders
}

export const useOwnerships = (year?: number, limit?: number) => {
    const [ownerships, setOwnerships] = useState<IOwnership[]>()
    useEffect(() => {
        getOwnerships(year, limit).then(o => {
            if (o.error) return
            setOwnerships(o)
        })
    }, [year, limit])
    return ownerships
}

export const useGetShareholder = (_id?: string, shareholderId?: string) => {
    const [shareholder, setShareholder] = useState<IShareholder>()
    useEffect(() => {
        if (_id) {
            getShareholder(_id).then(s => {
                if (s.error) return;
                setShareholder(s)
            })
        } else if (shareholderId) {
            getShareholder(undefined, shareholderId).then(s => {
                if (s.error) return;
                setShareholder(s)
            })
        }
    }, [_id, shareholderId])

    return shareholder
}

export const useGetOwnershipCount = (company?: ICompany, year?: number) => {
    const [count, setCount] = useState<number>()
    useEffect(() => {
        if (company && year) {
            getOwnershipCount(company, year).then(c => {
                if (c.error) return;
                setCount(c)
            })
        }
        return () => setCount(undefined)
    }, [company, year])

    return count
}

export const useCompanyGraph = (year?: number, limit?: number) => {
    const [ownerships, setOwnerships] = useState<IOwnership[]>();
    const [nodes, setNodes] = useState<{ [key: string]: Partial<ICompany & IShareholder> }>();

    useEffect(() => {
        if (year) {
            getCompanyGraph(year, limit).then(res => {
                if ((res as any).error) return;
                setOwnerships(res.ownerships);
                setNodes(res.nodes);
            })
        }
        return () => {
            setOwnerships(undefined);
            setNodes(undefined);
        }
    }, [year, limit]);

    return { ownerships, nodes };
}