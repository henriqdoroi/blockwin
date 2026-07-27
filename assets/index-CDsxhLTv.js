const __vite__mapDeps = (i, m=__vite__mapDeps, d=(m.f || (m.f = ["assets/Game-CMBg3PkX.js", "assets/rolldown-runtime-Bh1tDfsg.js", "assets/vendor-CM6qdn1s.js", "assets/music-CV-NtXu0.js", "assets/TutorialGame-6kUObV5S.js"]))) => i.map(i => d[i]);
import {n as e} from "./rolldown-runtime-Bh1tDfsg.js";
import {_ as t, a as n, b as r, c as i, d as a, f as o, g as s, h as c, i as l, l as u, m as d, n as f, o as p, p as m, r as h, s as g, t as _, u as v, v as y, y as b} from "./vendor-CM6qdn1s.js";
(function() {
    let e = document.createElement(`link`).relList;
    if (e && e.supports && e.supports(`modulepreload`))
        return;
    for (let e of document.querySelectorAll(`link[rel="modulepreload"]`))
        n(e);
    new MutationObserver(e => {
        for (let t of e)
            if (t.type === `childList`)
                for (let e of t.addedNodes)
                    e.tagName === `LINK` && e.rel === `modulepreload` && n(e)
    }
    ).observe(document, {
        childList: !0,
        subtree: !0
    });
    function t(e) {
        let t = {};
        return e.integrity && (t.integrity = e.integrity),
        e.referrerPolicy && (t.referrerPolicy = e.referrerPolicy),
        e.crossOrigin === `use-credentials` ? t.credentials = `include` : e.crossOrigin === `anonymous` ? t.credentials = `omit` : t.credentials = `same-origin`,
        t
    }
    function n(e) {
        if (e.ep)
            return;
        e.ep = !0;
        let n = t(e);
        fetch(e.href, n)
    }
}
)();
var x = e(r(), 1)
  , S = b()
  , C = class extends Error {
    status;
    code;
    constructor(e, t, n) {
        super(e),
        this.status = t,
        this.code = n,
        this.name = `ApiError`
    }
}
;
async function w(e) {
    let t = {};
    try {
        t = await e.json()
    } catch {}
    return new C(t.error?.message ?? `Erro de comunicação com o servidor`,e.status,t.error?.code ?? `UNKNOWN`)
}
async function T(e, t, n) {
    let r = {
        "X-Requested-With": `XMLHttpRequest`
    };
    return n !== void 0 && (r[`Content-Type`] = `application/json`),
    fetch(`` + e, {
        method: t,
        credentials: `include`,
        headers: r,
        body: n === void 0 ? void 0 : JSON.stringify(n)
    })
}
var E = null;
async function D() {
    return E ??= T(`/api/auth/refresh`, `POST`).then(e => e.ok).catch( () => !1).finally( () => {
        E = null
    }
    ),
    E
}
async function O(e, t=`GET`, n) {
    let r = await T(e, t, n);
    if (r.status === 401 && !e.startsWith(`/api/auth/`) && await D() && (r = await T(e, t, n)),
    !r.ok)
        throw await w(r);
    return await r.json()
}
var k = {
    register(e) {
        return O(`/api/auth/register`, `POST`, e)
    },
    login(e) {
        return O(`/api/auth/login`, `POST`, e)
    },
    me() {
        return O(`/api/auth/me`)
    },
    logout() {
        return O(`/api/auth/logout`, `POST`)
    }
}
  , A = u(e => ({
    user: null,
    balanceCents: 0,
    loading: !0,
    setSession(t, n) {
        e({
            user: t,
            balanceCents: n
        })
    },
    setBalance(t) {
        e({
            balanceCents: t
        })
    },
    async bootstrap() {
        try {
            let t = await k.me();
            e({
                user: t.user,
                balanceCents: t.balanceCents,
                loading: !1
            })
        } catch {
            e({
                user: null,
                balanceCents: 0,
                loading: !1
            })
        }
    },
    async logout() {
        try {
            await k.logout()
        } finally {
            e({
                user: null,
                balanceCents: 0
            })
        }
    }
}));
function j(e) {
    return (e / 100).toLocaleString(`pt-BR`, {
        style: `currency`,
        currency: `BRL`
    })
}
function M(e) {
    return new Date(e).toLocaleString(`pt-BR`, {
        day: `2-digit`,
        month: `2-digit`,
        hour: `2-digit`,
        minute: `2-digit`
    })
}
var N = i();
function P({to: e=`/`}) {
    return (0,
    N.jsx)(a, {
        to: e,
        className: `logo`,
        children: (0,
        N.jsx)(`img`, {
            src: `/images/logos/logoblock.png`,
            alt: `Block Blast`,
            className: `app-logo`
        })
    })
}
function F({variant: e=`primary`, size: t=`md`, block: n=!1, className: r=``, children: i, ...a}) {
    return (0,
    N.jsx)(`button`, {
        className: [`btn`, `btn-` + e, t === `md` ? `` : `btn-` + t, n ? `btn-block` : ``, r].filter(Boolean).join(` `),
        ...a,
        children: i
    })
}
function I() {
    let {user: e, balanceCents: t, logout: n} = A()
      , r = s();
    return (0,
    N.jsxs)(`header`, {
        className: `app-header`,
        children: [(0,
        N.jsx)(P, {
            to: e ? `/painel` : `/`
        }), (0,
        N.jsx)(`div`, {
            className: `header-actions`,
            children: e ? (0,
            N.jsxs)(N.Fragment, {
                children: [(0,
                N.jsx)(`span`, {
                    className: `balance-chip`,
                    title: `Seu saldo`,
                    children: j(t)
                }), (0,
                N.jsx)(F, {
                    variant: `ghost`,
                    size: `sm`,
                    onClick: () => {
                        n().then( () => r(`/`))
                    }
                    ,
                    children: `Sair`
                })]
            }) : (0,
            N.jsxs)(N.Fragment, {
                children: [(0,
                N.jsx)(F, {
                    variant: `ghost`,
                    size: `sm`,
                    onClick: () => r(`/login`),
                    children: `Entrar`
                }), (0,
                N.jsx)(F, {
                    size: `sm`,
                    onClick: () => r(`/cadastro`),
                    children: `Criar conta`
                })]
            })
        })]
    })
}
var L = p().trim().transform(e => e.replace(/\D/g, ``)).refine(e => e.length === 10 || e.length === 11, `Telefone inválido — informe DDD + número`)
  , R = n({
    name: p().trim().min(2, `Nome deve ter pelo menos 2 caracteres`).max(80, `Nome muito longo`).regex(/^[^<>]+$/, `Nome não pode conter os caracteres < ou >`),
    phone: L,
    password: p().min(6, `Senha deve ter pelo menos 6 caracteres`).max(128, `Senha muito longa`),
    ref: p().trim().toUpperCase().regex(/^[A-Z0-9]{4,12}$/, `Código de indicação inválido`).optional()
})
  , z = n({
    phone: L,
    password: p().min(1, `Informe a senha`).max(128)
})
  , B = n({
    currentPassword: p().min(1, `Informe a senha atual`).max(128),
    newPassword: p().min(6, `Senha deve ter pelo menos 6 caracteres`).max(128, `Senha muito longa`),
    confirmPassword: p().min(1, `Confirme a nova senha`).max(128)
}).refine(e => e.newPassword === e.confirmPassword, {
    message: `As senhas não coincidem`,
    path: [`confirmPassword`]
})
  , ee = n({
    amountCents: l().int(`Valor inválido`).min(100, `Valor mínimo de R$ 1,00`).max(1e8, `Valor acima do permitido`),
    acceptBonus: f().optional(),
    cupomCodigo: p().trim().min(1).max(32).optional()
})
  , V = n({
    amountCents: l().int(`Valor inválido`).min(100, `Valor mínimo de R$ 1,00`).max(1e8, `Valor acima do permitido`),
    pixKey: p().trim().min(5, `Chave PIX inválida`).max(140, `Chave PIX inválida`),
    cpf: p().trim().regex(/^\d{11}$/, `CPF inválido (11 dígitos, somente números)`)
});
n({
    betCents: l().int(`Valor inválido`).min(100, `Aposta mínima de R$ 1,00`).max(1e4, `Aposta máxima de R$ 100,00`)
}),
n({
    pieceIndex: l().int().min(0).max(2),
    row: l().int().min(0).max(7),
    col: l().int().min(0).max(7)
}),
n({
    txid: p().trim().min(1).max(128).optional(),
    transacao_id: p().trim().min(1).max(64).optional()
}).passthrough().refine(e => !!(e.txid || e.transacao_id), {
    message: `Informe o txid ou transacao_id`
}),
n({
    transacao_id: g([p().trim().min(1).max(64), l().int().positive()]),
    acao: _([`aprovar`, `pago_manual`, `reprovar`])
}).passthrough(),
n({
    valor: l().positive(),
    chave_pix: p().trim().min(5).max(140)
}).passthrough(),
n({
    codigo: p().trim().min(1).max(32)
}).passthrough(),
n({
    gateway_principal: p().max(32).optional(),
    pixup_client_id: p().max(256).optional(),
    pixup_client_secret: p().max(512).optional(),
    vizzion_public_key: p().max(512).optional(),
    vizzion_secret_key: p().max(512).optional(),
    amplo_public_key: p().max(512).optional(),
    amplo_secret_key: p().max(512).optional(),
    vexopag_public_key: p().max(512).optional(),
    vexopag_secret_key: p().max(512).optional(),
    nexall_public_key: p().max(512).optional(),
    nexall_secret_key: p().max(512).optional(),
    cashout_auto: g([f(), h(`1`), h(`0`), h(1), h(0)]).optional(),
    cashout_auto_max_jogador: g([l(), p()]).optional(),
    cashout_auto_max_afiliado: g([l(), p()]).optional(),
    cashout_auto_max_gerente: g([l(), p()]).optional(),
    _2fa_code: p().min(4).max(10).optional()
}).passthrough();
function H() {
    let[e,t] = (0,
    x.useState)( () => U());
    return (0,
    x.useEffect)( () => {
        let e = setInterval( () => t(U()), 1800);
        return () => clearInterval(e)
    }
    , []),
    (0,
    N.jsx)(`div`, {
        className: `hero-board`,
        "aria-hidden": !0,
        children: e.map( (e, t) => (0,
        N.jsx)(`div`, {
            className: e > 0 ? `hero-cell on c` + e : `hero-cell`
        }, t))
    })
}
function U() {
    return Array.from({
        length: 64
    }, () => Math.random() < .38 ? 1 + Math.floor(Math.random() * 6) : 0)
}
var W = `/images/banners/banner7.png`
  , te = `/images/banners/bannerparabens.png`;
function G(e) {
    if (typeof document > `u`)
        return;
    if (!document.head.querySelector(`link[rel="preload"][href="` + e + `"]`)) {
        let t = document.createElement(`link`);
        t.rel = `preload`,
        t.as = `image`,
        t.href = e,
        document.head.appendChild(t)
    }
    let t = new Image;
    t.decoding = `async`,
    t.src = e
}
var K = [{
    num: `1`,
    title: `Deposite via PIX`,
    text: `Adicione saldo à sua conta de forma rápida e segura para começar a jogar Block Blast.`,
    image: `/images/banners/banner-deposito.png`
}, {
    num: `2`,
    title: `Escolha sua entrada`,
    text: `Defina quanto quer apostar por partida. Quanto maior a entrada, maior a recompensa mínima.`,
    image: `/images/banners/banner-painel.png`
}, {
    num: `3`,
    title: `Monte e exploda linhas`,
    text: `Encaixe as peças no tabuleiro 8×8. Cada linha ou coluna completa explode e acumula prêmios.`,
    board: !0
}, {
    num: `4`,
    title: `Resgate e saque`,
    text: `Bateu a meta de 2×? Faça o cashout e retire seus ganhos via PIX na hora.`,
    image: `/images/banners/banner-saque.png`
}]
  , ne = [{
    text: `Comecei com R$ 10 e resgatei R$ 20 na primeira partida. O jogo é bom demais, muito fácil. O PIX caiu na hora!`,
    name: `Rafael Martins`,
    detail: `Usuário verificado`
}, {
    text: `Já era viciado em Block Blast de qualquer forma, agora ainda ganho dinheiro jogando. A tática é resgatar cedo e não ser ganancioso.`,
    name: `Camila Souza`,
    detail: `Usuário verificado`
}, {
    text: `Interface limpa, sem enrolação. Depositei, joguei e saquei no mesmo dia. Cada linha que explode é muito satisfatório.`,
    name: `Bruno Lima`,
    detail: `Usuário verificado`
}];
function re() {
    let e = s()
      , [t,n] = (0,
    x.useState)(2847);
    return (0,
    x.useEffect)( () => {
        let e, t = () => {
            e = setTimeout( () => {
                n(e => e + Math.floor(Math.random() * 5) + 1),
                t()
            }
            , 4e3 + Math.random() * 3e3)
        }
        ;
        return t(),
        () => clearTimeout(e)
    }
    , []),
    (0,
    x.useEffect)( () => {
        G(W)
    }
    , []),
    (0,
    N.jsxs)(`div`, {
        className: `landing`,
        children: [(0,
        N.jsx)(I, {}), (0,
        N.jsxs)(`main`, {
            children: [(0,
            N.jsxs)(`section`, {
                className: `lp-hero`,
                children: [(0,
                N.jsx)(`div`, {
                    className: `lp-hero-bg`,
                    "aria-hidden": !0
                }), (0,
                N.jsxs)(`div`, {
                    className: `lp-hero-inner`,
                    children: [(0,
                    N.jsxs)(`span`, {
                        className: `lp-live-pill`,
                        children: [(0,
                        N.jsx)(`span`, {
                            className: `live-dot`
                        }), (0,
                        N.jsx)(`strong`, {
                            children: t.toLocaleString(`pt-BR`)
                        }), ` jogadores online agora`]
                    }), (0,
                    N.jsxs)(`h1`, {
                        className: `lp-title`,
                        children: [`Encaixe os blocos`, (0,
                        N.jsx)(`br`, {}), `e `, (0,
                        N.jsx)(`span`, {
                            className: `lp-title-accent`,
                            children: `ganhe R$`
                        })]
                    }), (0,
                    N.jsx)(`div`, {
                        className: `lp-hero-banner`,
                        children: (0,
                        N.jsx)(`img`, {
                            src: `/images/banners/banner1-lp.png`,
                            alt: `Block Blast — encaixe os blocos e ganhe`
                        })
                    }), (0,
                    N.jsxs)(`div`, {
                        className: `lp-ctas`,
                        children: [(0,
                        N.jsx)(F, {
                            size: `lg`,
                            variant: `accent`,
                            block: !0,
                            className: `lp-btn-primary`,
                            onClick: () => e(`/cadastro`),
                            children: `Jogar agora`
                        }), (0,
                        N.jsx)(`button`, {
                            type: `button`,
                            className: `lp-btn-link`,
                            onClick: () => e(`/login`),
                            children: `Já tenho conta →`
                        })]
                    })]
                })]
            }), (0,
            N.jsxs)(`section`, {
                className: `lp-stats`,
                children: [(0,
                N.jsxs)(`div`, {
                    className: `lp-stat`,
                    children: [(0,
                    N.jsx)(`div`, {
                        className: `lp-stat-value`,
                        children: `1.933`
                    }), (0,
                    N.jsx)(`div`, {
                        className: `lp-stat-label`,
                        children: `Jogadores na arena`
                    })]
                }), (0,
                N.jsxs)(`div`, {
                    className: `lp-stat`,
                    children: [(0,
                    N.jsx)(`div`, {
                        className: `lp-stat-value`,
                        children: `R$ 8.523`
                    }), (0,
                    N.jsx)(`div`, {
                        className: `lp-stat-label`,
                        children: `Prêmios hoje`
                    })]
                }), (0,
                N.jsxs)(`div`, {
                    className: `lp-stat`,
                    children: [(0,
                    N.jsx)(`div`, {
                        className: `lp-stat-value`,
                        children: `R$ 987`
                    }), (0,
                    N.jsx)(`div`, {
                        className: `lp-stat-label`,
                        children: `Maior prêmio hoje`
                    })]
                })]
            }), (0,
            N.jsxs)(`section`, {
                className: `lp-howto`,
                children: [(0,
                N.jsxs)(`div`, {
                    className: `lp-howto-head`,
                    children: [(0,
                    N.jsx)(`span`, {
                        className: `lp-howto-icon`,
                        "aria-hidden": !0,
                        children: (0,
                        N.jsxs)(`svg`, {
                            viewBox: `0 0 24 24`,
                            fill: `none`,
                            stroke: `currentColor`,
                            strokeWidth: `2`,
                            children: [(0,
                            N.jsx)(`rect`, {
                                x: `2`,
                                y: `6`,
                                width: `20`,
                                height: `12`,
                                rx: `3`
                            }), (0,
                            N.jsx)(`path`, {
                                d: `M6 12h4M8 10v4M14 11h.01M17 13h.01`,
                                strokeLinecap: `round`
                            })]
                        })
                    }), (0,
                    N.jsx)(`h2`, {
                        className: `lp-howto-title`,
                        children: `Como Jogar`
                    }), (0,
                    N.jsx)(`p`, {
                        className: `lp-howto-sub`,
                        children: `Aprenda a faturar com Block Blast em 4 passos simples`
                    })]
                }), (0,
                N.jsx)(`div`, {
                    className: `lp-howto-scroll`,
                    children: K.map(e => (0,
                    N.jsxs)(`article`, {
                        className: `lp-howto-card`,
                        children: [(0,
                        N.jsxs)(`div`, {
                            className: `lp-howto-visual` + (e.board ? ` lp-howto-visual--board` : ``),
                            children: [e.board ? (0,
                            N.jsx)(H, {}) : (0,
                            N.jsx)(`img`, {
                                src: e.image,
                                alt: ``,
                                loading: `lazy`
                            }), (0,
                            N.jsx)(`span`, {
                                className: `lp-howto-badge`,
                                children: e.num
                            })]
                        }), (0,
                        N.jsxs)(`h3`, {
                            children: [e.num, `. `, e.title]
                        }), (0,
                        N.jsx)(`p`, {
                            children: e.text
                        })]
                    }, e.num))
                })]
            }), (0,
            N.jsxs)(`section`, {
                className: `lp-section lp-section-reviews`,
                children: [(0,
                N.jsx)(`h2`, {
                    className: `lp-section-title`,
                    children: `Quem joga, recomenda!`
                }), (0,
                N.jsx)(`p`, {
                    className: `lp-section-sub`,
                    children: `Resultados reais de jogadores reais`
                }), (0,
                N.jsx)(`div`, {
                    className: `lp-reviews`,
                    children: ne.map(e => (0,
                    N.jsxs)(`article`, {
                        className: `lp-review`,
                        children: [(0,
                        N.jsx)(`div`, {
                            className: `lp-review-stars`,
                            children: `★★★★★`
                        }), (0,
                        N.jsxs)(`p`, {
                            className: `lp-review-text`,
                            children: [`“`, e.text, `”`]
                        }), (0,
                        N.jsxs)(`div`, {
                            className: `lp-review-author`,
                            children: [(0,
                            N.jsx)(`span`, {
                                className: `winner-avatar`,
                                children: e.name.charAt(0)
                            }), (0,
                            N.jsxs)(`div`, {
                                children: [(0,
                                N.jsx)(`div`, {
                                    className: `lp-review-name`,
                                    children: e.name
                                }), (0,
                                N.jsxs)(`div`, {
                                    className: `lp-review-badge`,
                                    children: [`✓ `, e.detail]
                                })]
                            })]
                        })]
                    }, e.name))
                })]
            }), (0,
            N.jsxs)(`section`, {
                className: `lp-final`,
                children: [(0,
                N.jsx)(`h2`, {
                    children: `Pronto para montar e ganhar?`
                }), (0,
                N.jsx)(`p`, {
                    children: `Crie sua conta grátis, deposite a partir de R$ 20 e comece agora.`
                }), (0,
                N.jsx)(F, {
                    size: `lg`,
                    variant: `accent`,
                    block: !0,
                    className: `lp-btn-primary`,
                    onClick: () => e(`/cadastro`),
                    children: `Criar conta grátis`
                })]
            })]
        }), (0,
        N.jsxs)(`footer`, {
            className: `lp-footer`,
            children: [(0,
            N.jsx)(`img`, {
                src: `/images/logos/logoblock.png`,
                alt: `Block Blast`,
                className: `lp-footer-logo`
            }), (0,
            N.jsxs)(`p`, {
                className: `lp-footer-copy`,
                children: [`© `, new Date().getFullYear(), ` Block Blast. Todos os direitos reservados.`]
            }), (0,
            N.jsx)(`p`, {
                className: `lp-footer-note`,
                children: `Jogue com responsabilidade. Proibido para menores de 18 anos.`
            })]
        })]
    })
}
function ie({label: e, error: t, id: n, ...r}) {
    let i = n ?? (e ? `in-` + e.toLowerCase().replace(/\s+/g, `-`) : void 0);
    return (0,
    N.jsxs)(`div`, {
        className: `input-group`,
        children: [e ? (0,
        N.jsx)(`label`, {
            htmlFor: i,
            children: e
        }) : null, (0,
        N.jsx)(`input`, {
            id: i,
            className: `input`,
            ...r
        }), t ? (0,
        N.jsx)(`span`, {
            className: `input-error`,
            children: t
        }) : null]
    })
}
function ae({off: e}) {
    return (0,
    N.jsx)(`svg`, {
        width: `20`,
        height: `20`,
        viewBox: `0 0 24 24`,
        fill: `none`,
        stroke: `currentColor`,
        strokeWidth: `2`,
        strokeLinecap: `round`,
        strokeLinejoin: `round`,
        "aria-hidden": `true`,
        children: e ? (0,
        N.jsxs)(N.Fragment, {
            children: [(0,
            N.jsx)(`path`, {
                d: `M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94`
            }), (0,
            N.jsx)(`path`, {
                d: `M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19`
            }), (0,
            N.jsx)(`path`, {
                d: `M14.12 14.12a3 3 0 1 1-4.24-4.24`
            }), (0,
            N.jsx)(`line`, {
                x1: `1`,
                y1: `1`,
                x2: `23`,
                y2: `23`
            })]
        }) : (0,
        N.jsxs)(N.Fragment, {
            children: [(0,
            N.jsx)(`path`, {
                d: `M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z`
            }), (0,
            N.jsx)(`circle`, {
                cx: `12`,
                cy: `12`,
                r: `3`
            })]
        })
    })
}
function q({label: e, error: t, id: n, ...r}) {
    let[i,a] = (0,
    x.useState)(!1)
      , o = n ?? (e ? `in-` + e.toLowerCase().replace(/\s+/g, `-`) : `in-senha`);
    return (0,
    N.jsxs)(`div`, {
        className: `input-group`,
        children: [e ? (0,
        N.jsx)(`label`, {
            htmlFor: o,
            children: e
        }) : null, (0,
        N.jsxs)(`div`, {
            className: `input-password`,
            children: [(0,
            N.jsx)(`input`, {
                id: o,
                className: `input`,
                type: i ? `text` : `password`,
                ...r
            }), (0,
            N.jsx)(`button`, {
                type: `button`,
                className: `input-eye`,
                "aria-label": i ? `Ocultar senha` : `Mostrar senha`,
                onClick: () => a(e => !e),
                children: (0,
                N.jsx)(ae, {
                    off: i
                })
            })]
        }), t ? (0,
        N.jsx)(`span`, {
            className: `input-error`,
            children: t
        }) : null]
    })
}
function oe(e) {
    let t = e.replace(/\D/g, ``).slice(0, 11);
    return t.length <= 2 ? t : t.length <= 6 ? `(` + t.slice(0, 2) + `) ` + t.slice(2) : t.length <= 10 ? `(` + t.slice(0, 2) + `) ` + t.slice(2, 6) + `-` + t.slice(6) : `(` + t.slice(0, 2) + `) ` + t.slice(2, 7) + `-` + t.slice(7)
}
function se() {
    let e = s()
      , t = A(e => e.setSession)
      , [n,r] = (0,
    x.useState)(``)
      , [i,o] = (0,
    x.useState)(``)
      , [c,l] = (0,
    x.useState)(``)
      , [u,d] = (0,
    x.useState)(!1);
    async function f(r) {
        r.preventDefault(),
        l(``);
        let a = z.safeParse({
            phone: n,
            password: i
        });
        if (!a.success) {
            l(a.error.issues[0]?.message ?? `Dados inválidos`);
            return
        }
        d(!0);
        try {
            let n = await k.login(a.data);
            t(n.user, n.balanceCents),
            e(`/painel`)
        } catch (e) {
            l(e instanceof C ? e.message : `Erro ao entrar. Tente novamente.`)
        } finally {
            d(!1)
        }
    }
    return (0,
    N.jsx)(`div`, {
        className: `auth-shell`,
        children: (0,
        N.jsxs)(`div`, {
            className: `auth-page`,
            children: [(0,
            N.jsx)(a, {
                to: `/`,
                className: `auth-logo`,
                children: (0,
                N.jsx)(`img`, {
                    src: `/images/logos/logoblock.png`,
                    alt: `Block Blast`
                })
            }), (0,
            N.jsxs)(`div`, {
                className: `card auth-card`,
                children: [(0,
                N.jsx)(`h1`, {
                    children: `Bem-vindo de volta`
                }), (0,
                N.jsx)(`p`, {
                    className: `muted`,
                    children: `Entre para continuar jogando e resgatando.`
                }), c ? (0,
                N.jsx)(`div`, {
                    className: `alert alert-error`,
                    children: c
                }) : null, (0,
                N.jsxs)(`form`, {
                    onSubmit: f,
                    noValidate: !0,
                    children: [(0,
                    N.jsx)(ie, {
                        type: `tel`,
                        inputMode: `numeric`,
                        value: n,
                        maxLength: 16,
                        autoComplete: `tel`,
                        onChange: e => r(oe(e.target.value)),
                        placeholder: `Telefone com DDD (ex: 11 99999-0000)`,
                        "aria-label": `Telefone`
                    }), (0,
                    N.jsx)(q, {
                        value: i,
                        maxLength: 128,
                        autoComplete: `current-password`,
                        onChange: e => o(e.target.value),
                        placeholder: `Sua senha`,
                        "aria-label": `Senha`
                    }), (0,
                    N.jsx)(F, {
                        type: `submit`,
                        block: !0,
                        disabled: u,
                        children: u ? `Entrando…` : `Entrar`
                    })]
                }), (0,
                N.jsxs)(`p`, {
                    className: `auth-switch`,
                    children: [`Ainda não tem conta? `, (0,
                    N.jsx)(a, {
                        to: `/cadastro`,
                        children: `Cadastre-se grátis`
                    })]
                })]
            })]
        })
    })
}
var ce = `bb-tutorial-v1:`;
function le(e) {
    return `` + ce + e
}
function ue(e) {
    try {
        return localStorage.getItem(le(e)) === `1`
    } catch {
        return !1
    }
}
function de(e) {
    try {
        localStorage.setItem(le(e), `1`)
    } catch {}
}
function fe(e) {
    return !ue(e)
}
function pe() {
    let e = s()
      , n = A(e => e.setSession)
      , [r] = t()
      , [i,o] = (0,
    x.useState)(``)
      , [c,l] = (0,
    x.useState)(``)
      , [u,d] = (0,
    x.useState)(``)
      , [f,p] = (0,
    x.useState)(``)
      , [m,h] = (0,
    x.useState)(!1);
    (0,
    x.useEffect)( () => {
        G(W)
    }
    , []);
    let g = r.get(`ref`)?.trim().toUpperCase() ?? ``
      , _ = /^[A-Z0-9]{4,12}$/.test(g) ? g : void 0;
    async function v(t) {
        t.preventDefault(),
        p(``);
        let r = R.safeParse({
            name: i,
            phone: c,
            password: u,
            ref: _
        });
        if (!r.success) {
            p(r.error.issues[0]?.message ?? `Dados inválidos`);
            return
        }
        h(!0);
        try {
            let t = await k.register(r.data);
            n(t.user, t.balanceCents),
            e(fe(t.user.id) ? `/tutorial` : `/painel`)
        } catch (e) {
            p(e instanceof C ? e.message : `Erro ao cadastrar. Tente novamente.`)
        } finally {
            h(!1)
        }
    }
    return (0,
    N.jsx)(`div`, {
        className: `auth-shell`,
        children: (0,
        N.jsxs)(`div`, {
            className: `auth-page`,
            children: [(0,
            N.jsx)(a, {
                to: `/`,
                className: `auth-logo`,
                children: (0,
                N.jsx)(`img`, {
                    src: `/images/logos/logoblock.png`,
                    alt: `Block Blast`
                })
            }), (0,
            N.jsxs)(`div`, {
                className: `card auth-card`,
                children: [(0,
                N.jsx)(`h1`, {
                    children: `Criar conta`
                }), (0,
                N.jsx)(`p`, {
                    className: `muted`,
                    children: `Leva menos de 1 minuto. Jogue e saque via PIX.`
                }), _ ? (0,
                N.jsxs)(`div`, {
                    className: `alert alert-success`,
                    children: [`Você foi indicado por um amigo (código `, _, `).`]
                }) : null, f ? (0,
                N.jsx)(`div`, {
                    className: `alert alert-error`,
                    children: f
                }) : null, (0,
                N.jsxs)(`form`, {
                    onSubmit: v,
                    noValidate: !0,
                    children: [(0,
                    N.jsx)(ie, {
                        type: `text`,
                        value: i,
                        maxLength: 80,
                        autoComplete: `name`,
                        onChange: e => o(e.target.value),
                        placeholder: `Seu nome`,
                        "aria-label": `Nome`
                    }), (0,
                    N.jsx)(ie, {
                        type: `tel`,
                        inputMode: `numeric`,
                        value: c,
                        maxLength: 16,
                        autoComplete: `tel`,
                        onChange: e => l(oe(e.target.value)),
                        placeholder: `Telefone com DDD (ex: 11 99999-0000)`,
                        "aria-label": `Telefone`
                    }), (0,
                    N.jsx)(q, {
                        value: u,
                        maxLength: 128,
                        autoComplete: `new-password`,
                        onChange: e => d(e.target.value),
                        placeholder: `Senha (mín. 6 caracteres)`,
                        "aria-label": `Senha`
                    }), (0,
                    N.jsx)(F, {
                        type: `submit`,
                        block: !0,
                        disabled: m,
                        children: m ? `Criando conta…` : `Criar conta grátis`
                    })]
                }), (0,
                N.jsxs)(`p`, {
                    className: `auth-switch`,
                    children: [`Já tem conta? `, (0,
                    N.jsx)(a, {
                        to: `/login`,
                        children: `Entrar`
                    })]
                })]
            })]
        })
    })
}
function J(e) {
    if (e !== void 0)
        return e || null
}
var me = {
    fill: `none`,
    stroke: `currentColor`,
    strokeWidth: 1.8,
    strokeLinecap: `round`,
    strokeLinejoin: `round`
};
function he({onDeposit: e, onWithdraw: t, onPlay: n, onReferral: r, onProfile: i}) {
    return (0,
    N.jsxs)(`nav`, {
        className: `bottom-nav`,
        children: [(0,
        N.jsxs)(`button`, {
            type: `button`,
            className: `nav-item`,
            onClick: e,
            children: [(0,
            N.jsxs)(`svg`, {
                viewBox: `0 0 24 24`,
                ...me,
                children: [(0,
                N.jsx)(`rect`, {
                    x: `2.5`,
                    y: `5.5`,
                    width: `19`,
                    height: `13`,
                    rx: `2.5`
                }), (0,
                N.jsx)(`path`, {
                    d: `M2.5 9.5h19`
                }), (0,
                N.jsx)(`path`, {
                    d: `M6.5 14.5h4`
                })]
            }), `Depositar`]
        }), (0,
        N.jsxs)(`button`, {
            type: `button`,
            className: `nav-item`,
            onClick: t,
            children: [(0,
            N.jsxs)(`svg`, {
                viewBox: `0 0 24 24`,
                ...me,
                children: [(0,
                N.jsx)(`path`, {
                    d: `M12 4v11`
                }), (0,
                N.jsx)(`path`, {
                    d: `M7.5 10.5 12 15l4.5-4.5`
                }), (0,
                N.jsx)(`path`, {
                    d: `M4 19.5h16`
                })]
            }), `Sacar`]
        }), (0,
        N.jsxs)(`button`, {
            type: `button`,
            className: `nav-item center`,
            onClick: n,
            children: [(0,
            N.jsx)(`span`, {
                className: `nav-circle`,
                children: (0,
                N.jsxs)(`span`, {
                    className: `logo-mark`,
                    "aria-hidden": !0,
                    children: [(0,
                    N.jsx)(`span`, {}), (0,
                    N.jsx)(`span`, {}), (0,
                    N.jsx)(`span`, {}), (0,
                    N.jsx)(`span`, {})]
                })
            }), (0,
            N.jsx)(`span`, {
                children: `Jogar`
            })]
        }), (0,
        N.jsxs)(`button`, {
            type: `button`,
            className: `nav-item`,
            onClick: r,
            children: [(0,
            N.jsxs)(`svg`, {
                viewBox: `0 0 24 24`,
                ...me,
                children: [(0,
                N.jsx)(`circle`, {
                    cx: `9`,
                    cy: `8.5`,
                    r: `3`
                }), (0,
                N.jsx)(`path`, {
                    d: `M3.5 19c.6-3 2.8-4.5 5.5-4.5s4.9 1.5 5.5 4.5`
                }), (0,
                N.jsx)(`circle`, {
                    cx: `17`,
                    cy: `9.5`,
                    r: `2.3`
                }), (0,
                N.jsx)(`path`, {
                    d: `M16 14.7c2.3.2 4 1.5 4.5 4.3`
                })]
            }), `Indicar`]
        }), (0,
        N.jsxs)(`button`, {
            type: `button`,
            className: `nav-item`,
            onClick: i,
            children: [(0,
            N.jsxs)(`svg`, {
                viewBox: `0 0 24 24`,
                ...me,
                children: [(0,
                N.jsx)(`circle`, {
                    cx: `12`,
                    cy: `8`,
                    r: `3.4`
                }), (0,
                N.jsx)(`path`, {
                    d: `M5 19.5c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5`
                })]
            }), `Perfil`]
        })]
    })
}
function ge({onProfile: e}) {
    let {user: t, balanceCents: n} = A()
      , r = t?.name.charAt(0).toUpperCase() ?? `?`;
    return (0,
    N.jsxs)(`header`, {
        className: `panel-topbar`,
        children: [(0,
        N.jsx)(`img`, {
            src: `/images/logos/logoblock.png`,
            alt: `Block Blast`,
            className: `panel-topbar-logo`
        }), (0,
        N.jsxs)(`div`, {
            className: `panel-topbar-actions`,
            children: [(0,
            N.jsxs)(`div`, {
                className: `panel-balance`,
                children: [(0,
                N.jsx)(`span`, {
                    className: `panel-balance-label`,
                    children: `Saldo`
                }), (0,
                N.jsx)(`span`, {
                    className: `panel-balance-value`,
                    children: j(n)
                })]
            }), (0,
            N.jsx)(`button`, {
                type: `button`,
                className: `panel-profile-btn`,
                onClick: e,
                "aria-label": `Abrir perfil`,
                title: `Perfil`,
                children: r
            })]
        })]
    })
}
function Y({open: e, title: t, onClose: n, children: r, hero: i}) {
    return e ? (0,
    N.jsx)(`div`, {
        className: `sheet-overlay`,
        onClick: e => {
            e.target === e.currentTarget && n()
        }
        ,
        children: (0,
        N.jsxs)(`div`, {
            className: `sheet`,
            role: `dialog`,
            "aria-label": t,
            children: [i ? (0,
            N.jsxs)(`div`, {
                className: `sheet-hero`,
                children: [i, (0,
                N.jsx)(`div`, {
                    className: `sheet-handle sheet-handle-overlay`
                }), (0,
                N.jsx)(`button`, {
                    type: `button`,
                    className: `sheet-close sheet-close-overlay`,
                    onClick: n,
                    "aria-label": `Fechar`,
                    children: `✕`
                })]
            }) : (0,
            N.jsxs)(N.Fragment, {
                children: [(0,
                N.jsx)(`div`, {
                    className: `sheet-handle`
                }), (0,
                N.jsxs)(`div`, {
                    className: `sheet-header`,
                    children: [(0,
                    N.jsx)(`h2`, {
                        children: t
                    }), (0,
                    N.jsx)(`button`, {
                        type: `button`,
                        className: `sheet-close`,
                        onClick: n,
                        "aria-label": `Fechar`,
                        children: `✕`
                    })]
                })]
            }), r]
        })
    }) : null
}
var X = {
    getWallet() {
        return O(`/api/wallet/`)
    },
    depositInfo() {
        return O(`/api/wallet/deposit-info`)
    },
    withdrawInfo() {
        return O(`/api/wallet/withdraw-info`)
    },
    redeemCoupon(e) {
        return O(`/api/cupons/resgatar`, `POST`, {
            codigo: e
        })
    },
    deposit(e) {
        return O(`/api/wallet/deposit`, `POST`, e)
    },
    withdraw(e) {
        return O(`/api/wallet/withdraw`, `POST`, e)
    },
    withdrawAffiliate(e) {
        return O(`/api/wallet/withdraw-affiliate`, `POST`, e)
    }
}
  , _e = null
  , ve = null;
async function ye() {
    return _e || (ve ??= O(`/api/public/config`).then(e => (_e = e,
    e)).finally( () => {
        ve = null
    }
    ),
    ve)
}
function be() {
    let[e,t] = (0,
    x.useState)(null);
    return (0,
    x.useEffect)( () => {
        let e = !0;
        return ye().then(n => {
            e && t(n)
        }
        ).catch( () => void 0),
        () => {
            e = !1
        }
    }
    , []),
    e
}
var xe = [{
    cents: 2e3,
    badge: `MÍNIMO`,
    color: `#f59e0b`
}, {
    cents: 3e3,
    badge: `QUENTE`,
    color: `#ef4444`
}, {
    cents: 5e3,
    badge: `+CHANCES`,
    color: `#22c55e`
}, {
    cents: 1e4,
    badge: `BÔNUS`,
    color: `#8b5cf6`
}, {
    cents: 2e4,
    badge: `BÔNUS`,
    color: `#8b5cf6`
}];
function Se({open: e, onClose: t, onDone: n}) {
    let r = A(e => e.setBalance)
      , i = be()
      , a = i && i.deposito_valores_rapidos.length > 0 ? i.deposito_valores_rapidos.map(e => {
        let t = String(e % 1 == 0 ? Math.trunc(e) : e);
        return {
            cents: Math.round(e * 100),
            badge: i.deposito_botoes_labels[t] ?? ``,
            color: i.deposito_botoes_cores[t] ?? null
        }
    }
    ) : xe
      , o = i?.fin.deposito_minimo ?? 20
      , s = i?.fin.deposito_maximo ?? 1e4
      , [c,l] = (0,
    x.useState)(0)
      , [u,d] = (0,
    x.useState)(``)
      , [f,p] = (0,
    x.useState)(``)
      , [m,h] = (0,
    x.useState)(``)
      , [g,_] = (0,
    x.useState)(``)
      , [v,y] = (0,
    x.useState)(``)
      , [b,S] = (0,
    x.useState)(0)
      , [w,T] = (0,
    x.useState)(!1)
      , [E,D] = (0,
    x.useState)(!1)
      , O = J(`/images/banners/banner-deposito.png`)
      , [k,M] = (0,
    x.useState)(null)
      , [P,F] = (0,
    x.useState)(!0)
      , [I,L] = (0,
    x.useState)(!1)
      , [R,z] = (0,
    x.useState)(``)
      , [B,V] = (0,
    x.useState)(``)
      , [H,U] = (0,
    x.useState)(``)
      , [W,te] = (0,
    x.useState)(!1)
      , [G,K] = (0,
    x.useState)(null);
    (0,
    x.useEffect)( () => {
        e && X.depositInfo().then(M).catch( () => M(null))
    }
    , [e]),
    (0,
    x.useEffect)( () => {
        if (!m)
            return;
        let e = setInterval( () => S(e => e > 0 ? e - 1 : 0), 1e3);
        return () => clearInterval(e)
    }
    , [m]);
    function ne(e) {
        if (!k?.elegivel || e <= 0)
            return !1;
        let t = Math.round(k.bonus_minimo * 100)
          , n = Math.round(k.bonus_maximo * 100);
        return !(t > 0 && e < t || n > 0 && e > n)
    }
    let re = ne(c)
      , ie = re ? Math.round(c * (k?.bonus_percentual ?? 0) / 100) : 0;
    function ae() {
        h(``),
        _(``),
        y(``),
        S(0),
        T(!1),
        p(``),
        d(``)
    }
    function q() {
        ae(),
        l(0),
        L(!1),
        z(``),
        V(``),
        U(``),
        K(null),
        t()
    }
    async function oe() {
        d(``),
        p(``),
        U(``);
        let e = (G?.codigo || R).trim().toUpperCase() || void 0
          , t = ee.safeParse({
            amountCents: c,
            acceptBonus: re ? P : !0,
            cupomCodigo: e
        });
        if (!t.success) {
            d(t.error.issues[0]?.message ?? `Valor inválido`);
            return
        }
        D(!0);
        try {
            let i = await X.deposit(t.data);
            r(i.balanceCents),
            e && !G && (K({
                codigo: e,
                tipo: `bonus_deposito`,
                valor: 0
            }),
            V(`Cupom vinculado a este depósito.`)),
            i.pixCode ? (h(i.pixCode),
            _(i.qrcode ?? ``),
            y(i.txid ?? ``),
            S(300)) : i.transaction.status === `COMPLETED` && p(e ? `Pagamento confirmado! Saldo e cupom atualizados.` : `Pagamento confirmado! Saldo atualizado.`),
            n()
        } catch (t) {
            let n = t instanceof C ? t.message : `Erro no depósito`;
            e && /cupom/i.test(n) ? (L(!0),
            U(n)) : d(n)
        } finally {
            D(!1)
        }
    }
    async function se() {
        try {
            await navigator.clipboard.writeText(m),
            T(!0),
            setTimeout( () => T(!1), 2e3)
        } catch {}
    }
    async function ce() {
        V(``),
        U(``);
        let e = R.trim().toUpperCase();
        if (!e) {
            U(`Informe o código do cupom`);
            return
        }
        te(!0);
        try {
            let t = await X.redeemCoupon(e);
            t.tipo === `saldo` ? (r(Math.round(t.saldo_novo * 100)),
            V(`Cupom resgatado! Saldo atualizado.`),
            K(null)) : (K({
                codigo: e,
                tipo: t.tipo,
                valor: t.valor
            }),
            V(t.tipo === `bonus_deposito_pct` ? `Cupom ` + e + ` aplicado: +` + t.valor + `% neste depósito (após o PIX).` : `Cupom ` + e + ` aplicado: +` + j(Math.round(t.valor * 100)) + ` neste depósito (após o PIX).`)),
            z(e)
        } catch (e) {
            K(null),
            U(e instanceof C ? e.message : `Erro ao resgatar cupom`)
        } finally {
            te(!1)
        }
    }
    if (m) {
        let t = String(Math.floor(b / 60)).padStart(2, `0`)
          , n = String(b % 60).padStart(2, `0`);
        return (0,
        N.jsx)(Y, {
            open: e,
            title: `Depositar via PIX`,
            onClose: q,
            hero: O ? (0,
            N.jsx)(`img`, {
                src: O,
                alt: `Quanto maior seu depósito, maiores suas chances`
            }) : void 0,
            children: (0,
            N.jsxs)(`div`, {
                className: `pix-view`,
                children: [(0,
                N.jsxs)(`div`, {
                    className: `pix-timer` + (b <= 0 ? ` expired` : ``),
                    children: [(0,
                    N.jsx)(`span`, {
                        className: `pix-timer-label`,
                        children: b > 0 ? `Tempo restante` : `PIX expirado`
                    }), b > 0 ? (0,
                    N.jsxs)(`span`, {
                        className: `pix-timer-digits`,
                        children: [t, `:`, n]
                    }) : null]
                }), g ? (0,
                N.jsx)(`img`, {
                    src: g,
                    alt: `QR Code PIX`,
                    className: `pix-view-qr`
                }) : null, (0,
                N.jsx)(`div`, {
                    className: `pix-copy-box`,
                    children: m
                }), (0,
                N.jsx)(`button`, {
                    type: `button`,
                    className: `btn btn-ghost btn-sm`,
                    onClick: () => void se(),
                    children: w ? `Copiado!` : `Copiar código PIX`
                }), v ? (0,
                N.jsxs)(`div`, {
                    className: `pix-txid`,
                    children: [`txid: `, v]
                }) : null, (0,
                N.jsx)(`button`, {
                    type: `button`,
                    className: `pix-new-btn`,
                    onClick: ae,
                    children: `Novo depósito`
                })]
            })
        })
    }
    return (0,
    N.jsxs)(Y, {
        open: e,
        title: `Depositar via PIX`,
        onClose: q,
        hero: O ? (0,
        N.jsx)(`img`, {
            src: O,
            alt: `Quanto maior seu depósito, maiores suas chances`
        }) : void 0,
        children: [u ? (0,
        N.jsx)(`div`, {
            className: `alert alert-error`,
            children: u
        }) : null, f ? (0,
        N.jsx)(`div`, {
            className: `alert alert-success`,
            children: f
        }) : null, (0,
        N.jsxs)(`div`, {
            className: `sheet-section`,
            children: [(0,
            N.jsx)(`div`, {
                className: `panel-label`,
                children: `Valor rápido`
            }), (0,
            N.jsx)(`div`, {
                className: `quick-grid`,
                children: a.map(e => (0,
                N.jsxs)(`button`, {
                    type: `button`,
                    className: `quick-value` + (c === e.cents ? ` active` : ``) + (ne(e.cents) ? ` bonus-glow` : ``),
                    onClick: () => l(e.cents),
                    children: [e.badge ? (0,
                    N.jsx)(`span`, {
                        className: `quick-badge`,
                        style: {
                            background: e.color ?? `#f59e0b`
                        },
                        children: e.badge
                    }) : null, `R$`, e.cents / 100]
                }, e.cents))
            }), (0,
            N.jsxs)(`div`, {
                className: `money-input`,
                style: {
                    marginBottom: 0
                },
                children: [(0,
                N.jsx)(`span`, {
                    className: `prefix`,
                    children: `R$`
                }), (0,
                N.jsx)(`input`, {
                    type: `number`,
                    min: o,
                    max: s,
                    step: 5,
                    placeholder: `Mínimo R$ ` + o.toFixed(2).replace(`.`, `,`),
                    value: c > 0 ? c / 100 : ``,
                    onChange: e => l(Math.round(Number(e.target.value) * 100))
                })]
            })]
        }), re ? (0,
        N.jsxs)(`div`, {
            className: `bonus-card` + (P ? `` : ` off`),
            children: [(0,
            N.jsxs)(`div`, {
                className: `bonus-card-head`,
                children: [(0,
                N.jsxs)(`span`, {
                    className: `bonus-card-label`,
                    children: [`Bônus de `, k?.bonus_percentual ?? 0, `%`]
                }), (0,
                N.jsxs)(`label`, {
                    className: `bonus-card-use`,
                    children: [`Usar bônus`, (0,
                    N.jsx)(`button`, {
                        type: `button`,
                        role: `switch`,
                        "aria-checked": P,
                        className: `switch` + (P ? ` on` : ``),
                        onClick: () => F(e => !e),
                        children: (0,
                        N.jsx)(`span`, {
                            className: `knob`
                        })
                    })]
                })]
            }), (0,
            N.jsxs)(`div`, {
                className: `bonus-card-value`,
                children: [`+ `, j(P ? ie : 0)]
            }), (0,
            N.jsx)(`div`, {
                className: `bonus-card-divider`
            }), (0,
            N.jsxs)(`div`, {
                className: `bonus-card-total`,
                children: [`💰 Total na conta: `, (0,
                N.jsx)(`strong`, {
                    children: j(c + (P ? ie : 0))
                })]
            })]
        }) : null, (0,
        N.jsx)(`div`, {
            className: `cupom-section`,
            children: !I && !G ? (0,
            N.jsx)(`button`, {
                type: `button`,
                className: `cupom-link`,
                onClick: () => L(!0),
                children: `🎟️ Tenho um cupom`
            }) : (0,
            N.jsxs)(N.Fragment, {
                children: [(0,
                N.jsxs)(`div`, {
                    className: `cupom-row`,
                    children: [(0,
                    N.jsx)(`input`, {
                        type: `text`,
                        maxLength: 32,
                        autoComplete: `off`,
                        placeholder: `Código do cupom`,
                        value: R,
                        onChange: e => {
                            z(e.target.value.toUpperCase()),
                            K(null),
                            V(``),
                            U(``)
                        }
                    }), (0,
                    N.jsx)(`button`, {
                        type: `button`,
                        className: `btn btn-ghost btn-sm`,
                        disabled: W,
                        onClick: () => void ce(),
                        children: W ? `Aplicando…` : `Aplicar`
                    })]
                }), (0,
                N.jsx)(`p`, {
                    style: {
                        margin: `6px 0 0`,
                        fontSize: `0.78rem`,
                        color: `var(--text-dim)`
                    },
                    children: `Você também pode digitar o cupom e clicar em Gerar QR — ele será aplicado neste depósito.`
                }), B ? (0,
                N.jsx)(`div`, {
                    className: `alert alert-success`,
                    children: B
                }) : null, H ? (0,
                N.jsx)(`div`, {
                    className: `alert alert-error`,
                    children: H
                }) : null]
            })
        }), (0,
        N.jsx)(`button`, {
            type: `button`,
            className: `sheet-cta`,
            disabled: E || c <= 0,
            onClick: () => void oe(),
            children: E ? `Gerando…` : `Gerar QR Code PIX`
        })]
    })
}
function Ce({open: e, onClose: t, backdrop: n=`default`, className: r=``, children: i}) {
    return e ? (0,
    N.jsx)(`div`, {
        className: `modal-overlay` + (n === `clear` ? ` modal-overlay--clear` : ``) + (r ? ` ` + r : ``),
        onClick: e => {
            e.target === e.currentTarget && t?.()
        }
        ,
        children: (0,
        N.jsx)(`div`, {
            className: `modal`,
            children: i
        })
    }) : null
}
function we(e) {
    let t = typeof e.betCents == `number` ? e.betCents : typeof e.wageredCents == `number` ? e.wageredCents : typeof e.betCount == `number` ? Math.round(e.betCount * 100) : 0
      , n = typeof e.nextApostasCents == `number` ? e.nextApostasCents : typeof e.nextApostas == `number` ? Math.round(e.nextApostas * 100) : 0;
    return {
        currentCents: Number.isFinite(t) ? t : 0,
        nextCents: Number.isFinite(n) ? n : 0
    }
}
var Z = {
    async referrals() {
        let[e,t] = await Promise.all([O(`/api/users/referrals`), O(`/api/indicacao/info`).catch( () => null)]);
        return {
            refCode: e.refCode ?? t?.codigo ?? ``,
            link: e.link ?? t?.link ?? ``,
            commissionRate: e.commissionRate ?? (t ? t.comissao_nivel1_perc / 100 : 0),
            totalCommissionCents: e.totalCommissionCents ?? Math.round((t?.total_comissao ?? 0) * 100),
            affiliateBalanceCents: e.affiliateBalanceCents ?? Math.round((t?.saldo_afiliado ?? 0) * 100),
            n1Count: e.n1Count ?? t?.total_indicados ?? 0,
            n1DepositedCents: e.n1DepositedCents ?? 0,
            n2Count: e.n2Count ?? 0,
            n2DepositedCents: e.n2DepositedCents ?? 0,
            n3Count: e.n3Count ?? 0,
            n3DepositedCents: e.n3DepositedCents ?? 0,
            n4Count: e.n4Count ?? 0,
            n4DepositedCents: e.n4DepositedCents ?? 0,
            history: e.history ?? []
        }
    },
    changePassword(e) {
        return O(`/api/users/password`, `POST`, e)
    },
    async level() {
        return Te(await O(`/api/users/level`))
    }
};
function Q(e, t=0) {
    let n = typeof e == `number` ? e : Number(e);
    return Number.isFinite(n) ? n : t
}
function Te(e) {
    let t = e.nextBenefits && typeof e.nextBenefits == `object` ? e.nextBenefits : null
      , n = Q(e.nextSaqueDiarioCents) || Q(t?.saqueDiarioCents) || Math.round(Q(e.nextSaqueDiario) * 100) || 0
      , r = Q(e.nextSaqueSemanalCents) || Q(t?.saqueSemanalCents) || Math.round(Q(e.nextSaqueSemanal) * 100) || 0
      , i = Q(e.nextBonusDepositoPercent) || Q(t?.bonusDepositoPercent) || 0
      , a = e;
    return {
        ...a,
        nextSaqueDiarioCents: n,
        nextSaqueSemanalCents: r,
        nextBonusDepositoPercent: i,
        saqueDiarioCents: Q(e.saqueDiarioCents, a.saqueDiarioCents ?? 0),
        saqueSemanalCents: Q(e.saqueSemanalCents, a.saqueSemanalCents ?? 0),
        bonusDepositoPercent: Q(e.bonusDepositoPercent, a.bonusDepositoPercent ?? 0)
    }
}
function Ee({saqueDiario: e, saqueSemanal: t, bonusPct: n}) {
    return (0,
    N.jsxs)(`ul`, {
        className: `level-limit-list`,
        children: [(0,
        N.jsxs)(`li`, {
            children: [`Saque diário:`, ` `, (0,
            N.jsx)(`strong`, {
                children: e > 0 ? j(e) : `sem limite`
            })]
        }), (0,
        N.jsxs)(`li`, {
            children: [`Saque semanal:`, ` `, (0,
            N.jsx)(`strong`, {
                children: t > 0 ? j(t) : `sem limite`
            })]
        }), n > 0 ? (0,
        N.jsxs)(`li`, {
            children: [`Bônus de depósito: `, (0,
            N.jsxs)(`strong`, {
                children: [n, `%`]
            })]
        }) : null]
    })
}
function De({data: e, onClose: t}) {
    if (!e)
        return null;
    let n = e.levelInfo
      , r = Math.max(0, Math.min(100, n?.progress ?? 0))
      , {currentCents: i, nextCents: a} = n ? we(n) : {
        currentCents: 0,
        nextCents: 0
    }
      , o = e.saqueDiarioCents || n?.saqueDiarioCents || 0
      , s = e.saqueSemanalCents || n?.saqueSemanalCents || 0
      , c = e.bonusDepositoPercent || n?.bonusDepositoPercent || 0
      , l = e.nextLevel ?? n?.nextLevel ?? null
      , u = Number(e.nextSaqueDiarioCents || n?.nextSaqueDiarioCents || 0)
      , d = Number(e.nextSaqueSemanalCents || n?.nextSaqueSemanalCents || 0)
      , f = Number(e.nextBonusDepositoPercent || n?.nextBonusDepositoPercent || 0)
      , p = Math.max(0, (n?.nextDepositos ?? 0) - (n?.depositCount ?? 0))
      , m = Math.max(0, a - i)
      , h = e.periodoLabel === `diario` ? `diário` : `semanal`
      , g = !!(n?.ativo || n && n.level > 0)
      , _ = Math.max(0, Math.min(5, e.level || 0));
    return (0,
    N.jsx)(Ce, {
        open: !0,
        onClose: t,
        className: `level-limit-overlay`,
        children: (0,
        N.jsxs)(`div`, {
            className: `level-limit-modal`,
            "data-level": _,
            children: [(0,
            N.jsx)(`button`, {
                type: `button`,
                className: `level-limit-close`,
                onClick: t,
                "aria-label": `Fechar`,
                children: `✕`
            }), (0,
            N.jsxs)(`div`, {
                className: `level-limit-badge`,
                children: [`NV`, e.level]
            }), (0,
            N.jsx)(`h2`, {
                children: `Limite de saque`
            }), (0,
            N.jsxs)(`p`, {
                className: `level-limit-msg`,
                children: [`Você está no NV`, e.level, `, portanto seu limite de saque `, h, ` é`, ` `, (0,
                N.jsx)(`strong`, {
                    children: j(e.limiteCents)
                }), `.`]
            }), (0,
            N.jsxs)(`p`, {
                className: `level-limit-msg`,
                children: [`Você ainda pode sacar `, (0,
                N.jsx)(`strong`, {
                    children: j(e.restanteCents)
                }), ` `, e.periodoLabel === `diario` ? `hoje` : `nesta semana`, `. Reduza o valor e tente sacar novamente.`]
            }), g ? (0,
            N.jsxs)(`div`, {
                className: `level-limit-progress`,
                "data-level": _,
                children: [(0,
                N.jsxs)(`div`, {
                    className: `profile-level-top`,
                    children: [(0,
                    N.jsxs)(`div`, {
                        className: `profile-level-badge`,
                        children: [`Nível `, e.level > 0 ? e.level : `—`]
                    }), (0,
                    N.jsx)(`div`, {
                        className: `profile-level-meta`,
                        children: l == null ? `Nível máximo` : `Próximo nível`
                    })]
                }), (0,
                N.jsx)(`div`, {
                    className: `profile-level-bar`,
                    "aria-hidden": `true`,
                    children: (0,
                    N.jsx)(`div`, {
                        className: `profile-level-bar-fill`,
                        style: {
                            width: r + `%`
                        }
                    })
                }), (0,
                N.jsx)(`div`, {
                    className: `profile-level-foot`,
                    children: l == null ? (0,
                    N.jsx)(`span`, {
                        children: `Você alcançou o nível máximo.`
                    }) : (0,
                    N.jsxs)(`span`, {
                        children: [`Progresso `, r, `%`]
                    })
                })]
            }) : null, l == null ? null : (0,
            N.jsxs)(`div`, {
                className: `level-limit-section level-limit-howto`,
                children: [(0,
                N.jsx)(`div`, {
                    className: `level-limit-section-ttl`,
                    children: `Para subir para o próximo nível`
                }), (0,
                N.jsxs)(`ul`, {
                    className: `level-limit-list`,
                    children: [(0,
                    N.jsxs)(`li`, {
                        children: [`Faltam `, (0,
                        N.jsx)(`strong`, {
                            children: p
                        }), ` depósito(s)`]
                    }), (0,
                    N.jsxs)(`li`, {
                        children: [`Faltam `, (0,
                        N.jsx)(`strong`, {
                            children: j(m)
                        }), ` em apostas`]
                    })]
                })]
            }), (0,
            N.jsxs)(`div`, {
                className: `level-limit-section`,
                children: [(0,
                N.jsx)(`div`, {
                    className: `level-limit-section-ttl`,
                    children: `Benefícios do nível atual`
                }), (0,
                N.jsx)(Ee, {
                    saqueDiario: o,
                    saqueSemanal: s,
                    bonusPct: c
                })]
            }), l == null ? null : (0,
            N.jsxs)(`div`, {
                className: `level-limit-section`,
                children: [(0,
                N.jsx)(`div`, {
                    className: `level-limit-section-ttl`,
                    children: `Benefícios do próximo nível`
                }), (0,
                N.jsx)(Ee, {
                    saqueDiario: u,
                    saqueSemanal: d,
                    bonusPct: f
                })]
            }), (0,
            N.jsx)(`button`, {
                type: `button`,
                className: `panel-cta`,
                onClick: t,
                children: `Entendi`
            })]
        })
    })
}
function Oe({open: e, onClose: t, onDone: n, mode: r=`main`}) {
    let i = r === `affiliate`
      , {balanceCents: a, setBalance: o} = A()
      , [s,c] = (0,
    x.useState)(0)
      , l = i ? s : a
      , u = be()
      , d = i ? u?.fin.saque_afiliado_minimo ?? 30 : u?.fin.saque_minimo ?? 30
      , f = !i && (u?.fin.taxa_saque_ativo ?? !1)
      , p = u?.fin.taxa_saque_valor ?? 0
      , [m,h] = (0,
    x.useState)(0)
      , [g,_] = (0,
    x.useState)(``)
      , [v,y] = (0,
    x.useState)(``)
      , [b,S] = (0,
    x.useState)(``)
      , [w,T] = (0,
    x.useState)(``)
      , [E,D] = (0,
    x.useState)(!1)
      , [O,k] = (0,
    x.useState)(null)
      , [M,P] = (0,
    x.useState)(null)
      , [F,I] = (0,
    x.useState)(null)
      , L = J(`/images/banners/banner-saque.png`);
    (0,
    x.useEffect)( () => {
        if (!e) {
            S(``),
            T(``),
            I(null);
            return
        }
        if (i) {
            Z.referrals().then(e => c(e.affiliateBalanceCents)).catch( () => void 0);
            return
        }
        Promise.all([X.withdrawInfo().catch( () => null), Z.level().catch( () => null)]).then( ([e,t]) => {
            if (P(t),
            !e && !t) {
                k(null);
                return
            }
            let n = {
                rolloverPendenteCents: e?.rolloverPendenteCents ?? 0,
                nivelAtivo: e?.nivelAtivo ?? t?.ativo ?? !1,
                level: e?.level ?? t?.level ?? 0,
                nextLevel: e?.nextLevel ?? t?.nextLevel ?? null,
                limiteDiarioCents: e?.limiteDiarioCents || t?.saqueDiarioCents || 0,
                limiteSemanalCents: e?.limiteSemanalCents || t?.saqueSemanalCents || 0,
                restanteDiarioCents: e?.restanteDiarioCents,
                restanteSemanalCents: e?.restanteSemanalCents,
                bonusDepositoPercent: e?.bonusDepositoPercent ?? t?.bonusDepositoPercent ?? 0,
                nextSaqueDiarioCents: e?.nextSaqueDiarioCents || t?.nextSaqueDiarioCents || 0,
                nextSaqueSemanalCents: e?.nextSaqueSemanalCents || t?.nextSaqueSemanalCents || 0,
                nextBonusDepositoPercent: e?.nextBonusDepositoPercent || t?.nextBonusDepositoPercent || 0,
                saqueMaximoCents: e?.saqueMaximoCents ?? 0
            };
            n.nivelAtivo && n.level >= 1 && (n.limiteDiarioCents > 0 ? n.saqueMaximoCents = n.limiteDiarioCents : n.limiteSemanalCents > 0 && (n.saqueMaximoCents = n.limiteSemanalCents)),
            k(n)
        }
        )
    }
    , [e, i]);
    function R() {
        S(``),
        T(``),
        I(null),
        h(0),
        _(``),
        y(``),
        t()
    }
    function z(e) {
        if (!O)
            return;
        let t = e === `diario`
          , n = t ? Number(O.limiteDiarioCents) || 0 : Number(O.limiteSemanalCents) || 0
          , r = Number(t ? O.restanteDiarioCents ?? n : O.restanteSemanalCents ?? n);
        I({
            level: Number(O.level) || 0,
            limiteCents: n,
            restanteCents: Math.max(0, r),
            periodoLabel: e,
            saqueDiarioCents: Number(O.limiteDiarioCents) || 0,
            saqueSemanalCents: Number(O.limiteSemanalCents) || 0,
            bonusDepositoPercent: Number(O.bonusDepositoPercent) || 0,
            nextLevel: O.nextLevel ?? M?.nextLevel ?? null,
            nextSaqueDiarioCents: Number(O.nextSaqueDiarioCents) || Number(M?.nextSaqueDiarioCents) || 0,
            nextSaqueSemanalCents: Number(O.nextSaqueSemanalCents) || Number(M?.nextSaqueSemanalCents) || 0,
            nextBonusDepositoPercent: Number(O.nextBonusDepositoPercent) || Number(M?.nextBonusDepositoPercent) || 0,
            levelInfo: M
        })
    }
    async function B() {
        if (S(``),
        T(``),
        !i && O) {
            if (O.rolloverPendenteCents > 0) {
                S(`Falta ` + j(O.rolloverPendenteCents) + ` de rollover para liberar o saque.`);
                return
            }
            let e = Number(O.level) || 0
              , t = Number(O.limiteDiarioCents) || 0
              , n = Number(O.limiteSemanalCents) || 0
              , r = O.restanteDiarioCents == null ? t : Number(O.restanteDiarioCents)
              , i = O.restanteSemanalCents == null ? n : Number(O.restanteSemanalCents);
            if (O.nivelAtivo && e >= 1) {
                if (t > 0 && m > Math.min(t, Math.max(0, r))) {
                    z(`diario`);
                    return
                }
                if (n > 0 && m > Math.min(n, Math.max(0, i))) {
                    z(`semanal`);
                    return
                }
            }
            let a = Number(O.saqueMaximoCents) || 0;
            if (a > 0 && m > a && !(O.nivelAtivo && e >= 1 && (t > 0 || n > 0))) {
                S(`Saque máximo é ` + j(a) + `.`);
                return
            }
        }
        let e = V.safeParse({
            amountCents: m,
            pixKey: g,
            cpf: v.replace(/\D/g, ``)
        });
        if (!e.success) {
            S(e.error.issues[0]?.message ?? `Dados inválidos`);
            return
        }
        if (m > l) {
            S(`Saldo insuficiente para este saque`);
            return
        }
        D(!0);
        try {
            if (i) {
                let t = await X.withdrawAffiliate(e.data);
                c(t.balanceCents),
                T(`Saque de comissão solicitado! Será processado em breve.`)
            } else {
                let t = await X.withdraw(e.data);
                o(t.balanceCents),
                T(`Saque enviado! O PIX cai em instantes.`)
            }
            n()
        } catch (e) {
            let t = e instanceof C ? e.message : `Erro no saque`;
            !i && /limite de saque|NV\d|nível\s*\d/i.test(t) && O ? z(/semanal/i.test(t) ? `semanal` : `diario`) : S(t)
        } finally {
            D(!1)
        }
    }
    return (0,
    N.jsxs)(N.Fragment, {
        children: [(0,
        N.jsxs)(Y, {
            open: e,
            title: i ? `Sacar Comissões` : `Solicitar Saque`,
            onClose: R,
            hero: L ? (0,
            N.jsx)(`img`, {
                src: L,
                alt: `Solicitar saque via PIX`
            }) : void 0,
            children: [(0,
            N.jsx)(`div`, {
                className: `sheet-section`,
                children: (0,
                N.jsxs)(`div`, {
                    className: `saldo-row`,
                    children: [(0,
                    N.jsx)(`span`, {
                        className: `coin`,
                        children: `R$`
                    }), (0,
                    N.jsxs)(`div`, {
                        children: [(0,
                        N.jsx)(`div`, {
                            className: `label`,
                            children: i ? `Saldo de comissões` : `Saldo disponível`
                        }), (0,
                        N.jsx)(`div`, {
                            className: `value` + (l === 0 ? ` zero` : ``),
                            children: j(l)
                        })]
                    })]
                })
            }), b ? (0,
            N.jsx)(`div`, {
                className: `alert alert-error`,
                children: b
            }) : null, w ? (0,
            N.jsx)(`div`, {
                className: `alert alert-success`,
                children: w
            }) : null, (0,
            N.jsxs)(`div`, {
                className: `money-input`,
                children: [(0,
                N.jsx)(`span`, {
                    className: `prefix`,
                    children: `R$`
                }), (0,
                N.jsx)(`input`, {
                    type: `number`,
                    min: d,
                    step: 5,
                    placeholder: `Mínimo R$ ` + d.toFixed(2).replace(`.`, `,`),
                    value: m > 0 ? m / 100 : ``,
                    onChange: e => h(Math.round(Number(e.target.value) * 100))
                })]
            }), (0,
            N.jsxs)(`div`, {
                className: `money-input`,
                children: [(0,
                N.jsx)(`span`, {
                    className: `prefix`,
                    children: `PIX`
                }), (0,
                N.jsx)(`input`, {
                    type: `text`,
                    maxLength: 140,
                    autoComplete: `off`,
                    placeholder: `Chave PIX (e-mail, telefone ou chave aleatória)`,
                    value: g,
                    onChange: e => _(e.target.value)
                })]
            }), (0,
            N.jsxs)(`div`, {
                className: `money-input`,
                children: [(0,
                N.jsx)(`span`, {
                    className: `prefix`,
                    children: `CPF`
                }), (0,
                N.jsx)(`input`, {
                    type: `text`,
                    inputMode: `numeric`,
                    maxLength: 14,
                    autoComplete: `off`,
                    placeholder: `CPF do titular (somente números)`,
                    value: v,
                    onChange: e => y(e.target.value)
                })]
            }), (0,
            N.jsx)(`div`, {
                className: `notice-box`,
                children: i ? `Saques de comissão passam por aprovação e são processados em até 24h úteis.` : `Saques processados em até 24h úteis. ` + (f && p > 0 ? `Taxa de saque: ` + j(Math.round(p * 100)) + `.` : `Sem taxa de saque no momento.`)
            }), (0,
            N.jsx)(`button`, {
                type: `button`,
                className: `sheet-cta`,
                disabled: E || m <= 0,
                onClick: () => void B(),
                children: E ? `Enviando…` : `Solicitar Saque`
            })]
        }), (0,
        N.jsx)(De, {
            data: F,
            onClose: () => I(null)
        })]
    })
}
function ke({open: e, onClose: t, onWithdraw: n}) {
    let[r,i] = (0,
    x.useState)(null)
      , [a,o] = (0,
    x.useState)(!1)
      , [s,c] = (0,
    x.useState)(``)
      , l = J(`/images/banners/banner-indicar.png`);
    (0,
    x.useEffect)( () => {
        e && (c(``),
        Z.referrals().then(i).catch( () => c(`Não foi possível carregar seus dados de indicação.`)))
    }
    , [e]);
    async function u() {
        if (r)
            try {
                await navigator.clipboard.writeText(r.link),
                o(!0),
                setTimeout( () => o(!1), 2e3)
            } catch {}
    }
    return (0,
    N.jsxs)(Y, {
        open: e,
        title: `Indicar Amigos`,
        onClose: t,
        hero: l ? (0,
        N.jsx)(`img`, {
            src: l,
            alt: `Indique amigos e ganhe comissão`
        }) : void 0,
        children: [s ? (0,
        N.jsx)(`div`, {
            className: `alert alert-error`,
            children: s
        }) : null, (0,
        N.jsxs)(`div`, {
            className: `ref-card`,
            children: [(0,
            N.jsxs)(`div`, {
                className: `row`,
                children: [(0,
                N.jsxs)(`div`, {
                    children: [(0,
                    N.jsx)(`div`, {
                        className: `label`,
                        children: `Saldo de comissões`
                    }), (0,
                    N.jsx)(`div`, {
                        className: `big`,
                        children: j(r?.affiliateBalanceCents ?? 0)
                    }), (0,
                    N.jsxs)(`div`, {
                        className: `small`,
                        children: [`total recebido: `, j(r?.totalCommissionCents ?? 0)]
                    })]
                }), (0,
                N.jsxs)(`div`, {
                    style: {
                        textAlign: `right`
                    },
                    children: [(0,
                    N.jsx)(`div`, {
                        className: `label`,
                        children: `Indicados`
                    }), (0,
                    N.jsx)(`div`, {
                        className: `big`,
                        children: (r?.n1Count ?? 0) + (r?.n2Count ?? 0) + (r?.n3Count ?? 0) + (r?.n4Count ?? 0)
                    }), (0,
                    N.jsx)(`div`, {
                        className: `small`,
                        children: `no total`
                    })]
                })]
            }), (0,
            N.jsx)(`button`, {
                type: `button`,
                className: `cta`,
                onClick: n,
                children: `↑ Sacar Comissões`
            })]
        }), (0,
        N.jsxs)(`div`, {
            className: `sheet-section`,
            children: [(0,
            N.jsx)(`div`, {
                className: `panel-label ref-link-label`,
                children: `Seu link exclusivo`
            }), (0,
            N.jsx)(`div`, {
                className: `ref-link-value`,
                children: r?.link ?? `carregando…`
            }), (0,
            N.jsx)(`button`, {
                type: `button`,
                className: `btn btn-sm ref-copy-btn`,
                disabled: !r,
                onClick: () => void u(),
                children: a ? `Copiado!` : `Copiar`
            })]
        }), (0,
        N.jsxs)(`div`, {
            className: `ref-levels`,
            children: [(0,
            N.jsxs)(`div`, {
                className: `ref-level`,
                children: [(0,
                N.jsx)(`div`, {
                    className: `tier`,
                    children: `N1`
                }), (0,
                N.jsx)(`div`, {
                    className: `tier-sub`,
                    children: `diretos`
                }), (0,
                N.jsx)(`div`, {
                    className: `count`,
                    children: r?.n1Count ?? 0
                }), (0,
                N.jsx)(`div`, {
                    className: `count-sub`,
                    children: `indicados`
                }), (0,
                N.jsx)(`div`, {
                    className: `vol`,
                    children: j(r?.n1DepositedCents ?? 0)
                }), (0,
                N.jsx)(`div`, {
                    className: `count-sub`,
                    children: `volume depositado`
                })]
            }), (0,
            N.jsxs)(`div`, {
                className: `ref-level`,
                children: [(0,
                N.jsx)(`div`, {
                    className: `tier`,
                    children: `N2`
                }), (0,
                N.jsx)(`div`, {
                    className: `tier-sub`,
                    children: `2º nível`
                }), (0,
                N.jsx)(`div`, {
                    className: `count`,
                    children: r?.n2Count ?? 0
                }), (0,
                N.jsx)(`div`, {
                    className: `count-sub`,
                    children: `indicados`
                }), (0,
                N.jsx)(`div`, {
                    className: `vol`,
                    children: j(r?.n2DepositedCents ?? 0)
                }), (0,
                N.jsx)(`div`, {
                    className: `count-sub`,
                    children: `volume depositado`
                })]
            }), (0,
            N.jsxs)(`div`, {
                className: `ref-level`,
                children: [(0,
                N.jsx)(`div`, {
                    className: `tier`,
                    children: `N3`
                }), (0,
                N.jsx)(`div`, {
                    className: `tier-sub`,
                    children: `3º nível`
                }), (0,
                N.jsx)(`div`, {
                    className: `count`,
                    children: r?.n3Count ?? 0
                }), (0,
                N.jsx)(`div`, {
                    className: `count-sub`,
                    children: `indicados`
                }), (0,
                N.jsx)(`div`, {
                    className: `vol`,
                    children: j(r?.n3DepositedCents ?? 0)
                }), (0,
                N.jsx)(`div`, {
                    className: `count-sub`,
                    children: `volume depositado`
                })]
            }), (0,
            N.jsxs)(`div`, {
                className: `ref-level`,
                children: [(0,
                N.jsx)(`div`, {
                    className: `tier`,
                    children: `N4`
                }), (0,
                N.jsx)(`div`, {
                    className: `tier-sub`,
                    children: `4º nível`
                }), (0,
                N.jsx)(`div`, {
                    className: `count`,
                    children: r?.n4Count ?? 0
                }), (0,
                N.jsx)(`div`, {
                    className: `count-sub`,
                    children: `indicados`
                }), (0,
                N.jsx)(`div`, {
                    className: `vol`,
                    children: j(r?.n4DepositedCents ?? 0)
                }), (0,
                N.jsx)(`div`, {
                    className: `count-sub`,
                    children: `volume depositado`
                })]
            })]
        }), (0,
        N.jsxs)(`div`, {
            className: `sheet-section`,
            children: [(0,
            N.jsx)(`div`, {
                className: `panel-label`,
                children: `Histórico de comissões`
            }), r && r.history.length > 0 ? (0,
            N.jsx)(`div`, {
                className: `ref-history`,
                children: r.history.map( (e, t) => (0,
                N.jsxs)(`div`, {
                    className: `ref-history-item`,
                    children: [(0,
                    N.jsxs)(`div`, {
                        className: `ref-history-info`,
                        children: [(0,
                        N.jsxs)(`div`, {
                            className: `ref-history-name`,
                            children: [e.indicadoName, (0,
                            N.jsxs)(`span`, {
                                className: `ref-history-nivel`,
                                children: [`N`, e.nivel]
                            })]
                        }), (0,
                        N.jsxs)(`div`, {
                            className: `ref-history-dep`,
                            children: [`depositou `, j(e.depositCents), ` ·`, ` `, new Date(e.createdAt).toLocaleDateString(`pt-BR`)]
                        })]
                    }), (0,
                    N.jsxs)(`div`, {
                        className: `ref-history-value`,
                        children: [`+`, j(e.commissionCents)]
                    })]
                }, t))
            }) : (0,
            N.jsx)(`div`, {
                className: `ref-history-empty`,
                children: `Nenhuma comissão recebida ainda. Compartilhe seu link!`
            })]
        })]
    })
}
function Ae(e) {
    return Array.isArray(e) ? e.map(e => {
        if (!e || typeof e != `object`)
            return null;
        let t = String(e.nome ?? ``).trim()
          , n = String(e.url ?? ``).trim();
        return !t || !n || !/^https?:\/\//i.test(n) ? null : {
            nome: t,
            url: n
        }
    }
    ).filter(e => e != null) : []
}
function je({open: e, openLabel: t, closedLabel: n, onClick: r}) {
    return (0,
    N.jsxs)(`button`, {
        type: `button`,
        className: `profile-history-toggle`,
        onClick: r,
        children: [e ? t : n, (0,
        N.jsx)(`svg`, {
            viewBox: `0 0 24 24`,
            fill: `none`,
            stroke: `currentColor`,
            strokeWidth: `2.5`,
            style: {
                transform: e ? `rotate(180deg)` : `none`,
                transition: `transform 0.2s`
            },
            children: (0,
            N.jsx)(`path`, {
                d: `m6 9 6 6 6-6`,
                strokeLinecap: `round`,
                strokeLinejoin: `round`
            })
        })]
    })
}
function Me({open: e, onClose: t, stats: n, transactions: r, history: i}) {
    let a = s()
      , {user: o, logout: c} = A()
      , l = be()
      , u = ( () => {
        let e = Ae(l?.suporte_links);
        if (e.length > 0)
            return e;
        let t = String(l?.site_suporte ?? ``).trim();
        return t && /^https?:\/\//i.test(t) ? [{
            nome: `Suporte`,
            url: t
        }] : []
    }
    )()
      , [d,f] = (0,
    x.useState)(null)
      , [p,m] = (0,
    x.useState)(null)
      , [h,g] = (0,
    x.useState)(!1)
      , [_,v] = (0,
    x.useState)(!1)
      , [y,b] = (0,
    x.useState)(!1)
      , [S,C] = (0,
    x.useState)(!1)
      , [w,T] = (0,
    x.useState)(``)
      , [E,D] = (0,
    x.useState)(``)
      , [O,k] = (0,
    x.useState)(``)
      , [P,F] = (0,
    x.useState)(``)
      , [I,L] = (0,
    x.useState)(``)
      , [R,z] = (0,
    x.useState)(!1)
      , ee = r.filter(e => e.type === `DEPOSIT` || e.type === `WITHDRAW`);
    (0,
    x.useEffect)( () => {
        if (!e) {
            v(!1),
            b(!1),
            C(!1),
            T(``),
            D(``),
            k(``),
            F(``),
            L(``);
            return
        }
        Z.referrals().then(f).catch( () => f(null)),
        Z.level().then(m).catch( () => m(null))
    }
    , [e]);
    async function V() {
        if (d?.link)
            try {
                await navigator.clipboard.writeText(d.link),
                g(!0),
                setTimeout( () => g(!1), 2e3)
            } catch {}
    }
    async function H() {
        F(``),
        L(``);
        let e = B.safeParse({
            currentPassword: w,
            newPassword: E,
            confirmPassword: O
        });
        if (!e.success) {
            F(e.error.issues[0]?.message ?? `Dados inválidos`);
            return
        }
        z(!0);
        try {
            await Z.changePassword(e.data),
            L(`Senha alterada com sucesso!`),
            T(``),
            D(``),
            k(``)
        } catch (e) {
            F(e instanceof Error ? e.message : `Não foi possível alterar a senha.`)
        } finally {
            z(!1)
        }
    }
    return (0,
    N.jsxs)(Y, {
        open: e,
        title: `Perfil`,
        onClose: t,
        children: [(0,
        N.jsx)(`div`, {
            className: `sheet-section profile-user`,
            children: (0,
            N.jsxs)(`div`, {
                className: `saldo-row`,
                children: [(0,
                N.jsx)(`span`, {
                    className: `winner-avatar`,
                    children: o?.name.charAt(0).toUpperCase()
                }), (0,
                N.jsxs)(`div`, {
                    className: `profile-user-info`,
                    children: [(0,
                    N.jsx)(`div`, {
                        className: `profile-user-name`,
                        children: o?.name
                    }), (0,
                    N.jsx)(`div`, {
                        className: `profile-user-phone`,
                        children: o?.phone ? oe(o.phone) : ``
                    }), (0,
                    N.jsxs)(`div`, {
                        className: `profile-ref-row`,
                        children: [(0,
                        N.jsx)(`span`, {
                            className: `profile-ref-link`,
                            children: d?.link ?? `carregando…`
                        }), (0,
                        N.jsx)(`button`, {
                            type: `button`,
                            className: `profile-ref-copy`,
                            disabled: !d?.link,
                            onClick: () => void V(),
                            children: h ? `Copiado!` : `Copiar link`
                        })]
                    })]
                })]
            })
        }), p?.ativo ? (0,
        N.jsxs)(`div`, {
            className: `sheet-section profile-level`,
            "data-level": Math.max(0, Math.min(5, p.level || 0)),
            children: [(0,
            N.jsxs)(`div`, {
                className: `profile-level-top`,
                children: [(0,
                N.jsxs)(`div`, {
                    className: `profile-level-badge`,
                    children: [`Nível `, p.level > 0 ? p.level : `—`]
                }), (0,
                N.jsx)(`div`, {
                    className: `profile-level-meta`,
                    children: p.nextLevel == null ? `Nível máximo atingido` : `Meta: Nível ` + p.nextLevel
                })]
            }), (0,
            N.jsx)(`div`, {
                className: `profile-level-bar`,
                "aria-hidden": `true`,
                children: (0,
                N.jsx)(`div`, {
                    className: `profile-level-bar-fill`,
                    style: {
                        width: Math.max(0, Math.min(100, p.progress)) + `%`
                    }
                })
            }), (0,
            N.jsx)(`div`, {
                className: `profile-level-foot`,
                children: p.nextLevel == null ? (0,
                N.jsxs)(`span`, {
                    children: [`Você alcançou o nível máximo (`, p.maxLevel, `).`]
                }) : (0,
                N.jsx)(`span`, {
                    children: ( () => {
                        let {currentCents: e, nextCents: t} = we(p);
                        return (0,
                        N.jsxs)(N.Fragment, {
                            children: [`Progresso `, p.progress ?? 0, `% · `, p.depositCount ?? 0, `/`, p.nextDepositos ?? 0, ` depósitos · `, j(e), `/`, j(t), ` em apostas`]
                        })
                    }
                    )()
                })
            })]
        }) : null, (0,
        N.jsxs)(`div`, {
            className: `quick-stats profile-stats`,
            children: [(0,
            N.jsxs)(`div`, {
                className: `quick-stat`,
                children: [(0,
                N.jsx)(`div`, {
                    className: `v`,
                    children: n?.gamesPlayed ?? 0
                }), (0,
                N.jsx)(`div`, {
                    className: `l`,
                    children: `Partidas`
                })]
            }), (0,
            N.jsxs)(`div`, {
                className: `quick-stat`,
                children: [(0,
                N.jsx)(`div`, {
                    className: `v`,
                    children: n?.gamesWon ?? 0
                }), (0,
                N.jsx)(`div`, {
                    className: `l`,
                    children: `Resgates`
                })]
            }), (0,
            N.jsxs)(`div`, {
                className: `quick-stat`,
                children: [(0,
                N.jsx)(`div`, {
                    className: `v`,
                    children: j(n?.totalWonCents ?? 0)
                }), (0,
                N.jsx)(`div`, {
                    className: `l`,
                    children: `Total ganho`
                })]
            }), (0,
            N.jsxs)(`div`, {
                className: `quick-stat`,
                children: [(0,
                N.jsx)(`div`, {
                    className: `v`,
                    children: j(n?.biggestWinCents ?? 0)
                }), (0,
                N.jsx)(`div`, {
                    className: `l`,
                    children: `Maior resgate`
                })]
            })]
        }), (0,
        N.jsxs)(`div`, {
            className: `sheet-section`,
            children: [(0,
            N.jsxs)(`div`, {
                className: `profile-history-header`,
                children: [(0,
                N.jsx)(`div`, {
                    className: `panel-label`,
                    style: {
                        margin: 0
                    },
                    children: `Últimas transações`
                }), (0,
                N.jsx)(je, {
                    open: _,
                    openLabel: `Ocultar`,
                    closedLabel: `Ver histórico`,
                    onClick: () => v(e => !e)
                })]
            }), _ && (0,
            N.jsx)(`div`, {
                className: `tx-list profile-scroll`,
                style: {
                    marginTop: 12
                },
                children: ee.length === 0 ? (0,
                N.jsx)(`p`, {
                    style: {
                        color: `var(--text-dim)`,
                        fontSize: `0.9rem`
                    },
                    children: `Nenhum depósito ou saque ainda.`
                }) : ee.slice(0, 10).map(e => {
                    let t = e.type === `DEPOSIT`;
                    return (0,
                    N.jsxs)(`div`, {
                        className: `tx-item`,
                        children: [(0,
                        N.jsxs)(`div`, {
                            className: `tx-item-main`,
                            children: [(0,
                            N.jsx)(`div`, {
                                className: `d`,
                                children: t ? `Depósito` : `Saque`
                            }), (0,
                            N.jsx)(`div`, {
                                className: `t`,
                                children: M(e.createdAt)
                            })]
                        }), (0,
                        N.jsxs)(`span`, {
                            className: `tx-amount ` + (t ? `pos` : `neg`),
                            children: [t ? `+` : `-`, j(e.amountCents)]
                        })]
                    }, e.id)
                }
                )
            })]
        }), (0,
        N.jsxs)(`div`, {
            className: `sheet-section`,
            children: [(0,
            N.jsxs)(`div`, {
                className: `profile-history-header`,
                children: [(0,
                N.jsx)(`div`, {
                    className: `panel-label`,
                    style: {
                        margin: 0
                    },
                    children: `Histórico de partidas`
                }), (0,
                N.jsx)(je, {
                    open: y,
                    openLabel: `Ocultar`,
                    closedLabel: `Ver partidas`,
                    onClick: () => b(e => !e)
                })]
            }), y && (0,
            N.jsx)(`div`, {
                className: `hist-list profile-scroll`,
                style: {
                    marginTop: 12
                },
                children: i.length === 0 ? (0,
                N.jsx)(`p`, {
                    style: {
                        color: `var(--text-dim)`,
                        fontSize: `0.9rem`
                    },
                    children: `Você ainda não jogou nenhuma partida.`
                }) : i.slice(0, 10).map(e => (0,
                N.jsxs)(`div`, {
                    className: `tx-item`,
                    children: [(0,
                    N.jsxs)(`div`, {
                        className: `tx-item-main`,
                        children: [(0,
                        N.jsxs)(`div`, {
                            className: `d`,
                            children: [`Aposta `, j(e.betCents), ` · `, e.linesCleared, ` linhas`]
                        }), (0,
                        N.jsx)(`div`, {
                            className: `t`,
                            children: M(e.createdAt)
                        })]
                    }), e.status === `CASHED_OUT` ? (0,
                    N.jsxs)(`span`, {
                        className: `badge badge-green`,
                        children: [`+`, j(e.payoutCents)]
                    }) : (0,
                    N.jsx)(`span`, {
                        className: `badge badge-red`,
                        children: `Perdeu`
                    })]
                }, e.id))
            })]
        }), (0,
        N.jsxs)(`div`, {
            className: `sheet-section profile-password-card`,
            children: [(0,
            N.jsxs)(`div`, {
                className: `profile-history-header`,
                children: [(0,
                N.jsx)(`div`, {
                    className: `panel-label`,
                    style: {
                        margin: 0
                    },
                    children: `Alterar senha`
                }), (0,
                N.jsx)(je, {
                    open: S,
                    openLabel: `Ocultar`,
                    closedLabel: `Alterar senha`,
                    onClick: () => C(e => !e)
                })]
            }), S && (0,
            N.jsxs)(N.Fragment, {
                children: [P ? (0,
                N.jsx)(`div`, {
                    className: `alert alert-error`,
                    children: P
                }) : null, I ? (0,
                N.jsx)(`div`, {
                    className: `alert alert-success`,
                    children: I
                }) : null, (0,
                N.jsx)(q, {
                    label: `Senha atual`,
                    value: w,
                    autoComplete: `current-password`,
                    onChange: e => T(e.target.value)
                }), (0,
                N.jsx)(q, {
                    label: `Nova senha`,
                    value: E,
                    autoComplete: `new-password`,
                    onChange: e => D(e.target.value)
                }), (0,
                N.jsx)(q, {
                    label: `Confirmar nova senha`,
                    value: O,
                    autoComplete: `new-password`,
                    onChange: e => k(e.target.value)
                }), (0,
                N.jsx)(`button`, {
                    type: `button`,
                    className: `btn btn-primary btn-block`,
                    disabled: R,
                    onClick: () => void H(),
                    children: R ? `Salvando…` : `Salvar nova senha`
                })]
            })]
        }), u.length > 0 ? (0,
        N.jsxs)(`div`, {
            className: `sheet-section profile-support`,
            children: [(0,
            N.jsx)(`div`, {
                className: `panel-label`,
                children: `Suporte`
            }), (0,
            N.jsx)(`div`, {
                className: `profile-support-list`,
                children: u.map(e => (0,
                N.jsxs)(`a`, {
                    href: e.url,
                    target: `_blank`,
                    rel: `noopener noreferrer`,
                    className: `profile-support-link`,
                    children: [(0,
                    N.jsx)(`span`, {
                        children: e.nome
                    }), (0,
                    N.jsxs)(`svg`, {
                        viewBox: `0 0 24 24`,
                        fill: `none`,
                        stroke: `currentColor`,
                        strokeWidth: `2`,
                        "aria-hidden": !0,
                        children: [(0,
                        N.jsx)(`path`, {
                            d: `M7 17 17 7`,
                            strokeLinecap: `round`
                        }), (0,
                        N.jsx)(`path`, {
                            d: `M8 7h9v9`,
                            strokeLinecap: `round`,
                            strokeLinejoin: `round`
                        })]
                    })]
                }, e.nome + `-` + e.url))
            })]
        }) : null, (0,
        N.jsx)(`button`, {
            type: `button`,
            className: `btn btn-danger btn-block`,
            onClick: () => {
                c().then( () => a(`/`))
            }
            ,
            children: `Sair da conta`
        })]
    })
}
var Ne = `Gustavo.Karina.Lucas.Amanda.Rafael.Juliana.Bruno.Camila.Thiago.Fernanda.Diego.Larissa.Matheus.Beatriz.Felipe.Carla.André.Patrícia.Rodrigo.Vanessa.Leandro.Aline.Marcelo.Tatiane.Vinícius.Priscila.Eduardo.Renata.Caio.Sabrina.Igor.Daniela.Wesley.Bianca.Fábio.Michele.Alex.Natália.Douglas.Jéssica`.split(`.`)
  , Pe = {
    withdraw: {
        verb: `acabou de sacar`,
        icon: `↑`
    },
    deposit: {
        verb: `acabou de depositar`,
        icon: `↓`
    },
    win: {
        verb: `acabou de ganhar`,
        icon: `★`
    }
};
function Fe(e, t) {
    return e + Math.random() * (t - e)
}
function Ie() {
    let e = [`withdraw`, `deposit`, `win`], t = e[Math.floor(Math.random() * e.length)], n;
    return n = t === `withdraw` ? Math.round(Fe(8e3, 35e3)) : t === `deposit` ? Math.round(Fe(3, 100)) * 1e3 : Math.round(Fe(2e3, 2e4)),
    {
        key: Date.now(),
        kind: t,
        name: Ne[Math.floor(Math.random() * Ne.length)],
        amountCents: n
    }
}
var Le = 5e3;
function Re() {
    let[e,t] = (0,
    x.useState)(null)
      , [n,r] = (0,
    x.useState)(!1);
    if ((0,
    x.useEffect)( () => {
        let e = []
          , n = () => {
            let i = Fe(8e3, 15e3);
            e.push(setTimeout( () => {
                r(!1),
                t(Ie()),
                e.push(setTimeout( () => {
                    r(!0),
                    e.push(setTimeout( () => t(null), 400)),
                    n()
                }
                , Le))
            }
            , i))
        }
        ;
        return n(),
        () => {
            e.forEach(clearTimeout),
            e = []
        }
    }
    , []),
    !e)
        return null;
    let i = Pe[e.kind];
    return (0,
    N.jsxs)(`div`, {
        className: `live-toast` + (n ? ` leaving` : ``),
        children: [(0,
        N.jsx)(`span`, {
            className: `live-toast-icon ` + e.kind,
            children: i.icon
        }), (0,
        N.jsxs)(`div`, {
            className: `live-toast-body`,
            children: [(0,
            N.jsx)(`div`, {
                className: `live-toast-name`,
                children: e.name
            }), (0,
            N.jsx)(`div`, {
                className: `live-toast-text`,
                children: i.verb
            })]
        }), (0,
        N.jsx)(`div`, {
            className: `live-toast-amount`,
            children: j(e.amountCents)
        })]
    }, e.key)
}
function ze({onDismiss: e, onInstall: t}) {
    return (0,
    N.jsxs)(`div`, {
        className: `install-bar`,
        role: `region`,
        "aria-label": `Instalar aplicativo`,
        children: [(0,
        N.jsx)(`button`, {
            type: `button`,
            className: `install-bar-close`,
            onClick: e,
            "aria-label": `Fechar`,
            children: `✕`
        }), (0,
        N.jsx)(`img`, {
            src: `/images/icons/icon.png`,
            alt: ``,
            className: `install-bar-icon`
        }), (0,
        N.jsxs)(`p`, {
            className: `install-bar-text`,
            children: [`Baixe Nosso APP,`, (0,
            N.jsx)(`br`, {}), `Ganhe Super Prêmios! `, (0,
            N.jsx)(`span`, {
                "aria-hidden": !0,
                children: `💰`
            })]
        }), (0,
        N.jsxs)(`button`, {
            type: `button`,
            className: `install-bar-cta`,
            onClick: t,
            children: [(0,
            N.jsxs)(`svg`, {
                viewBox: `0 0 24 24`,
                fill: `none`,
                stroke: `currentColor`,
                strokeWidth: `2`,
                "aria-hidden": !0,
                children: [(0,
                N.jsx)(`path`, {
                    d: `M12 3v12`,
                    strokeLinecap: `round`
                }), (0,
                N.jsx)(`path`, {
                    d: `m7 10 5 5 5-5`,
                    strokeLinecap: `round`,
                    strokeLinejoin: `round`
                }), (0,
                N.jsx)(`path`, {
                    d: `M5 19h14`,
                    strokeLinecap: `round`
                })]
            }), `Instalar`]
        })]
    })
}
var Be = [{
    num: 1,
    color: `#3b82f6`,
    title: `Passo 1`,
    text: (0,
    N.jsxs)(N.Fragment, {
        children: [`Clique nos `, (0,
        N.jsx)(`strong`, {
            children: `três pontinhos`
        }), ` na barra inferior do Safari e toque em`, ` `, (0,
        N.jsx)(`strong`, {
            children: `Compartilhar`
        }), `.`]
    }),
    icon: (0,
    N.jsxs)(`svg`, {
        viewBox: `0 0 24 24`,
        fill: `none`,
        stroke: `currentColor`,
        strokeWidth: `2`,
        children: [(0,
        N.jsx)(`path`, {
            d: `M12 3v11`,
            strokeLinecap: `round`
        }), (0,
        N.jsx)(`path`, {
            d: `m8 7 4-4 4 4`,
            strokeLinecap: `round`,
            strokeLinejoin: `round`
        }), (0,
        N.jsx)(`path`, {
            d: `M8 13H6a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-2`,
            strokeLinecap: `round`
        })]
    })
}, {
    num: 2,
    color: `#22c55e`,
    title: `Passo 2`,
    text: (0,
    N.jsxs)(N.Fragment, {
        children: [`Clique em `, (0,
        N.jsx)(`strong`, {
            children: `"Ver mais"`
        }), `, depois em`, ` `, (0,
        N.jsx)(`strong`, {
            children: `"Adicionar à Tela de Início"`
        }), `.`]
    }),
    icon: (0,
    N.jsxs)(`svg`, {
        viewBox: `0 0 24 24`,
        fill: `none`,
        stroke: `currentColor`,
        strokeWidth: `2`,
        children: [(0,
        N.jsx)(`rect`, {
            x: `4`,
            y: `4`,
            width: `16`,
            height: `16`,
            rx: `3`
        }), (0,
        N.jsx)(`path`, {
            d: `M12 8v8M8 12h8`,
            strokeLinecap: `round`
        })]
    })
}, {
    num: 3,
    color: `#f59e0b`,
    title: `Passo 3`,
    text: (0,
    N.jsxs)(N.Fragment, {
        children: [`Agora é só clicar em `, (0,
        N.jsx)(`strong`, {
            children: `"Adicionar"`
        }), ` no canto superior direito.`]
    }),
    icon: (0,
    N.jsx)(`svg`, {
        viewBox: `0 0 24 24`,
        fill: `none`,
        stroke: `currentColor`,
        strokeWidth: `2.5`,
        children: (0,
        N.jsx)(`path`, {
            d: `M5 13l4 4L19 7`,
            strokeLinecap: `round`,
            strokeLinejoin: `round`
        })
    })
}];
function Ve({open: e, onClose: t}) {
    return (0,
    N.jsxs)(N.Fragment, {
        children: [(0,
        N.jsx)(Y, {
            open: e,
            title: `Instalar App`,
            onClose: t,
            children: (0,
            N.jsxs)(`div`, {
                className: `install-modal`,
                children: [(0,
                N.jsxs)(`div`, {
                    className: `install-modal-head`,
                    children: [(0,
                    N.jsx)(`div`, {
                        className: `install-modal-badge`,
                        "aria-hidden": !0,
                        children: (0,
                        N.jsxs)(`svg`, {
                            viewBox: `0 0 24 24`,
                            fill: `none`,
                            stroke: `currentColor`,
                            strokeWidth: `1.8`,
                            children: [(0,
                            N.jsx)(`rect`, {
                                x: `7`,
                                y: `2`,
                                width: `10`,
                                height: `18`,
                                rx: `2`
                            }), (0,
                            N.jsx)(`path`, {
                                d: `M10 18h4`,
                                strokeLinecap: `round`
                            })]
                        })
                    }), (0,
                    N.jsx)(`h2`, {
                        children: `Instalar App`
                    }), (0,
                    N.jsx)(`p`, {
                        children: `Siga os passos abaixo para adicionar à tela de início`
                    })]
                }), (0,
                N.jsx)(`div`, {
                    className: `install-modal-steps`,
                    children: Be.map(e => (0,
                    N.jsxs)(`article`, {
                        className: `install-step`,
                        children: [(0,
                        N.jsx)(`div`, {
                            className: `install-step-icon`,
                            style: {
                                background: e.color
                            },
                            children: e.icon
                        }), (0,
                        N.jsxs)(`div`, {
                            children: [(0,
                            N.jsx)(`div`, {
                                className: `install-step-title`,
                                children: e.title
                            }), (0,
                            N.jsx)(`p`, {
                                className: `install-step-text`,
                                children: e.text
                            })]
                        })]
                    }, e.num))
                }), (0,
                N.jsx)(`p`, {
                    className: `install-modal-foot`,
                    children: `O ícone do app aparecerá na sua tela de início.`
                })]
            })
        }), e ? (0,
        N.jsx)(`div`, {
            className: `install-arrow-hint`,
            "aria-hidden": !0,
            children: `👇`
        }) : null]
    })
}
function He({amountCents: e, onPlay: t}) {
    return (0,
    N.jsx)(Ce, {
        open: e != null,
        children: (0,
        N.jsxs)(`div`, {
            className: `deposit-confirmed-modal`,
            role: `status`,
            "aria-live": `assertive`,
            children: [(0,
            N.jsx)(`div`, {
                className: `deposit-confirmed-icon`,
                "aria-hidden": `true`,
                children: (0,
                N.jsx)(`svg`, {
                    viewBox: `0 0 24 24`,
                    fill: `none`,
                    children: (0,
                    N.jsx)(`path`, {
                        d: `m5 12 4 4L19 6`
                    })
                })
            }), (0,
            N.jsx)(`h2`, {
                children: `Depósito confirmado!`
            }), (0,
            N.jsxs)(`div`, {
                className: `deposit-confirmed-value`,
                children: [`Depósito de `, j(e ?? 0), ` confirmado`]
            }), (0,
            N.jsx)(`p`, {
                children: `Comece a jogar`
            }), (0,
            N.jsx)(`button`, {
                type: `button`,
                className: `panel-cta`,
                onClick: t,
                children: `Jogar`
            })]
        })
    })
}
function Ue(e) {
    let t = e.trim();
    return t ? /^https?:\/\//i.test(t) || t.startsWith(`data:`) ? t : `` + t : ``
}
function We({popup: e, open: t, onClose: n, onDeposit: r, onPlay: i}) {
    if (!e)
        return null;
    let a = e
      , o = a.imagem_url ? Ue(a.imagem_url) : ``
      , s = a.btn_texto?.trim() ?? ``;
    function c() {
        let e = a.btn_acao || `fechar`;
        if (n(),
        e === `depositar`) {
            r();
            return
        }
        if (e === `jogar`) {
            i();
            return
        }
        e === `link` && a.btn_url?.trim() && window.open(a.btn_url.trim(), `_blank`, `noopener,noreferrer`)
    }
    return (0,
    N.jsx)(Ce, {
        open: t,
        onClose: n,
        className: `site-popup-overlay`,
        children: (0,
        N.jsxs)(`div`, {
            className: `site-popup` + (o ? ` site-popup--has-image` : ``),
            role: `dialog`,
            "aria-modal": `true`,
            "aria-labelledby": `site-popup-title`,
            children: [(0,
            N.jsx)(`button`, {
                type: `button`,
                className: `site-popup-close`,
                onClick: n,
                "aria-label": `Fechar`,
                children: `×`
            }), o ? (0,
            N.jsx)(`div`, {
                className: `site-popup-media`,
                children: (0,
                N.jsx)(`img`, {
                    className: `site-popup-image`,
                    src: o,
                    alt: ``
                })
            }) : null, (0,
            N.jsxs)(`div`, {
                className: `site-popup-body`,
                children: [!o && a.icone?.trim() ? (0,
                N.jsx)(`div`, {
                    className: `site-popup-icon`,
                    "aria-hidden": !0,
                    children: a.icone
                }) : null, a.titulo?.trim() ? (0,
                N.jsx)(`h2`, {
                    id: `site-popup-title`,
                    children: a.titulo.trim()
                }) : (0,
                N.jsx)(`span`, {
                    id: `site-popup-title`,
                    className: `sr-only`,
                    children: `Aviso`
                }), a.mensagem?.trim() ? (0,
                N.jsx)(`p`, {
                    className: `site-popup-msg`,
                    children: a.mensagem.trim()
                }) : null, s ? (0,
                N.jsx)(`button`, {
                    type: `button`,
                    className: `panel-cta site-popup-cta`,
                    onClick: c,
                    children: s
                }) : null]
            })]
        })
    })
}
var Ge = `bb-install-bar-dismissed`;
function Ke() {
    return window.matchMedia(`(display-mode: standalone)`).matches || window.navigator.standalone === !0
}
function qe() {
    try {
        return localStorage.getItem(Ge) === `1`
    } catch {
        return !1
    }
}
function Je() {
    try {
        localStorage.setItem(Ge, `1`)
    } catch {}
}
var $ = null;
function Ye() {
    let e = e => {
        e.preventDefault(),
        $ = e
    }
    ;
    return window.addEventListener(`beforeinstallprompt`, e),
    () => {
        window.removeEventListener(`beforeinstallprompt`, e),
        $ = null
    }
}
async function Xe() {
    if (!$)
        return !1;
    await $.prompt();
    let {outcome: e} = await $.userChoice;
    return $ = null,
    e === `accepted`
}
var Ze = `bb_site_popup_seen`;
function Qe(e=new Date) {
    let t = new Date(Date.UTC(e.getFullYear(), 0, 1))
      , n = Math.floor((e.getTime() - t.getTime()) / 864e5)
      , r = Math.ceil((n + t.getUTCDay() + 1) / 7);
    return e.getFullYear() + `-W` + r
}
function $e(e) {
    let t = new Date;
    return e === `dia` ? t.toISOString().slice(0, 10) : e === `semana` ? Qe(t) : `1`
}
function et(e) {
    if (!e?.ativo || !(e.imagem_url?.trim() || e.icone?.trim() || e.titulo?.trim() || e.mensagem?.trim()))
        return !1;
    let t = e.frequencia || `sessao`;
    if (t === `sempre`)
        return !0;
    let n = $e(t);
    try {
        return t === `sessao` ? sessionStorage.getItem(Ze) !== n : localStorage.getItem(Ze) !== t + `:` + n
    } catch {
        return !0
    }
}
function tt(e) {
    let t = e || `sessao`;
    if (t === `sempre`)
        return;
    let n = $e(t);
    try {
        if (t === `sessao`) {
            sessionStorage.setItem(Ze, n);
            return
        }
        localStorage.setItem(Ze, t + `:` + n)
    } catch {}
}
var nt = {
    getConfig() {
        return O(`/api/game/config`)
    },
    getActive() {
        return O(`/api/game/active`)
    },
    start(e) {
        return O(`/api/game/start`, `POST`, {
            betCents: e
        })
    },
    move(e, t) {
        return O(`/api/game/` + e + `/move`, `POST`, t)
    },
    cashout(e) {
        return O(`/api/game/` + e + `/cashout`, `POST`)
    },
    forfeit() {
        return O(`/api/game/forfeit`, `POST`)
    },
    forfeitOnLeave() {
        fetch(`/api/game/forfeit`, {
            method: `POST`,
            credentials: `include`,
            keepalive: !0,
            headers: {
                "X-Requested-With": `XMLHttpRequest`
            }
        }).catch( () => void 0)
    },
    history() {
        return O(`/api/game/history`)
    },
    stats() {
        return O(`/api/users/stats`)
    }
}
  , rt = [300, 500, 1e3, 2e3, 5e3, 1e4];
function it() {
    let e = s()
      , t = c()
      , {balanceCents: n, setBalance: r} = A()
      , i = be()
      , a = J(`/images/banners/banner-painel.png`)
      , o = i && i.entrada_valores.length > 0 ? i.entrada_valores.map(e => Math.round(e * 100)) : rt
      , [l,u] = (0,
    x.useState)(null)
      , [d,f] = (0,
    x.useState)(1e3)
      , [p,m] = (0,
    x.useState)(null)
      , [h,g] = (0,
    x.useState)(null)
      , _ = (0,
    x.useRef)(null)
      , v = (0,
    x.useRef)(!1)
      , [y,b] = (0,
    x.useState)([])
      , [S,C] = (0,
    x.useState)([])
      , [w,T] = (0,
    x.useState)(null)
      , [E,D] = (0,
    x.useState)(329)
      , [O,k] = (0,
    x.useState)( () => !Ke() && !qe())
      , [M,P] = (0,
    x.useState)(!1)
      , [F,I] = (0,
    x.useState)(!1);
    (0,
    x.useEffect)( () => Ye(), []),
    (0,
    x.useEffect)( () => {
        t.state?.openDeposit && (m(`deposit`),
        e(`/painel`, {
            replace: !0,
            state: null
        }))
    }
    , [t.state, e]),
    (0,
    x.useEffect)( () => {
        i?.popup && h == null && et(i.popup) && I(!0)
    }
    , [i, h]);
    function L() {
        tt(i?.popup?.frequencia),
        I(!1)
    }
    (0,
    x.useEffect)( () => {
        let e, t = () => {
            e = setTimeout( () => {
                D(e => e + 15 + Math.floor(Math.random() * 21)),
                t()
            }
            , 1500 + Math.random() * 2500)
        }
        ;
        return t(),
        () => clearTimeout(e)
    }
    , []);
    let R = (0,
    x.useCallback)(e => {
        v.current = e.transactions.some(e => e.type === `DEPOSIT` && e.status === `PENDING`);
        let t = e.transactions.filter(e => e.type === `DEPOSIT` && e.status === `COMPLETED`);
        if (_.current === null)
            _.current = new Set(t.map(e => e.id));
        else {
            let e = t.find(e => !_.current?.has(e.id));
            t.forEach(e => _.current?.add(e.id)),
            e && (m(null),
            g(e.amountCents))
        }
        r(e.balanceCents),
        b(e.transactions)
    }
    , [r])
      , z = (0,
    x.useCallback)(async () => {
        try {
            let[e,t,n] = await Promise.all([X.getWallet(), nt.history(), nt.stats()]);
            R(e),
            C(t.games),
            T(n)
        } catch {}
    }
    , [R]);
    (0,
    x.useEffect)( () => {
        z(),
        nt.getConfig().then(u).catch( () => void 0)
    }
    , [z]),
    (0,
    x.useEffect)( () => {
        let e = window.setInterval( () => {
            document.visibilityState !== `visible` || !v.current || X.getWallet().then(R).catch( () => void 0)
        }
        , 4e3);
        return () => window.clearInterval(e)
    }
    , [R]);
    let B = n >= d && d > 0
      , ee = l ? Math.round(d * l.targetMultiplier) : d * 2;
    function V() {
        if (!(d <= 0)) {
            if (!B) {
                m(`deposit`);
                return
            }
            e(`/jogo`, {
                state: {
                    betCents: d
                }
            })
        }
    }
    function H() {
        g(null),
        m(null),
        e(`/painel`)
    }
    async function U() {
        await Xe() || P(!0)
    }
    function W() {
        Je(),
        k(!1)
    }
    return (0,
    N.jsxs)(`div`, {
        className: `panel-shell` + (O ? ` panel--has-install-bar` : ``),
        children: [O ? (0,
        N.jsx)(ze, {
            onDismiss: W,
            onInstall: () => void U()
        }) : null, (0,
        N.jsx)(ge, {
            onProfile: () => m(`profile`)
        }), (0,
        N.jsx)(`div`, {
            className: `panel-page`,
            children: (0,
            N.jsxs)(`div`, {
                className: `panel-card`,
                children: [(0,
                N.jsxs)(`div`, {
                    className: `panel-banner`,
                    children: [a ? (0,
                    N.jsx)(`img`, {
                        src: a,
                        alt: `Block Blast`
                    }) : null, (0,
                    N.jsxs)(`span`, {
                        className: `online-fire-pill`,
                        "aria-live": `polite`,
                        children: [(0,
                        N.jsx)(`span`, {
                            className: `live-count`,
                            children: E.toLocaleString(`pt-BR`)
                        }), (0,
                        N.jsx)(`span`, {
                            className: `online-label`,
                            children: `online`
                        })]
                    })]
                }), (0,
                N.jsx)(`div`, {
                    className: `panel-label`,
                    children: `Valor de entrada`
                }), (0,
                N.jsx)(`div`, {
                    className: `entry-grid`,
                    children: o.map(e => (0,
                    N.jsxs)(`button`, {
                        type: `button`,
                        className: `entry-chip` + (d === e ? ` active` : ``),
                        onClick: () => f(e),
                        children: [`R$`, e / 100]
                    }, e))
                }), (0,
                N.jsxs)(`div`, {
                    className: `money-input`,
                    children: [(0,
                    N.jsx)(`span`, {
                        className: `prefix`,
                        children: `R$`
                    }), (0,
                    N.jsx)(`input`, {
                        type: `number`,
                        min: l ? l.minBetCents / 100 : 1,
                        max: l ? l.maxBetCents / 100 : 100,
                        step: 1,
                        value: d > 0 ? d / 100 : ``,
                        onChange: e => f(Math.round(Number(e.target.value) * 100))
                    })]
                }), (0,
                N.jsxs)(`div`, {
                    className: `reward-box`,
                    children: [(0,
                    N.jsx)(`div`, {
                        className: `label`,
                        children: `Recompensa mínima`
                    }), (0,
                    N.jsx)(`div`, {
                        className: `value`,
                        children: j(ee)
                    })]
                }), (0,
                N.jsx)(`button`, {
                    type: `button`,
                    className: `panel-cta`,
                    disabled: d <= 0,
                    onClick: V,
                    children: B ? `Jogar` : `Depositar para jogar`
                })]
            })
        }), (0,
        N.jsx)(Re, {}), (0,
        N.jsx)(he, {
            onDeposit: () => m(`deposit`),
            onWithdraw: () => m(`withdraw`),
            onPlay: V,
            onReferral: () => m(`referral`),
            onProfile: () => m(`profile`)
        }), (0,
        N.jsx)(Se, {
            open: p === `deposit`,
            onClose: () => m(null),
            onDone: () => void z()
        }), (0,
        N.jsx)(Oe, {
            open: p === `withdraw`,
            onClose: () => m(null),
            onDone: () => void z(),
            onOpenDetails: () => m(`profile`)
        }), (0,
        N.jsx)(Oe, {
            mode: `affiliate`,
            open: p === `withdraw-affiliate`,
            onClose: () => m(null),
            onDone: () => void z()
        }), (0,
        N.jsx)(ke, {
            open: p === `referral`,
            onClose: () => m(null),
            onWithdraw: () => m(`withdraw-affiliate`)
        }), (0,
        N.jsx)(Me, {
            open: p === `profile`,
            onClose: () => m(null),
            stats: w,
            transactions: y,
            history: S
        }), (0,
        N.jsx)(Ve, {
            open: M,
            onClose: () => P(!1)
        }), (0,
        N.jsx)(He, {
            amountCents: h,
            onPlay: H
        }), (0,
        N.jsx)(We, {
            popup: i?.popup,
            open: F && h == null,
            onClose: L,
            onDeposit: () => m(`deposit`),
            onPlay: V
        })]
    })
}
var at = (0,
x.lazy)( () => y( () => import(`./Game-CMBg3PkX.js`).then(e => ({
    default: e.Game
})), __vite__mapDeps([0, 1, 2, 3])))
  , ot = (0,
x.lazy)( () => y( () => import(`./TutorialGame-6kUObV5S.js`).then(e => ({
    default: e.TutorialGame
})), __vite__mapDeps([4, 1, 2, 3])));
function st({children: e}) {
    let {user: t, loading: n} = A();
    return n ? (0,
    N.jsx)(`div`, {
        className: `spinner`
    }) : t ? (0,
    N.jsx)(N.Fragment, {
        children: e
    }) : (0,
    N.jsx)(o, {
        to: `/login`,
        replace: !0
    })
}
function ct() {
    let e = A(e => e.bootstrap);
    return (0,
    x.useEffect)( () => {
        e()
    }
    , [e]),
    (0,
    N.jsx)(v, {
        children: (0,
        N.jsxs)(d, {
            children: [(0,
            N.jsx)(m, {
                path: `/`,
                element: (0,
                N.jsx)(re, {})
            }), (0,
            N.jsx)(m, {
                path: `/login`,
                element: (0,
                N.jsx)(se, {})
            }), (0,
            N.jsx)(m, {
                path: `/cadastro`,
                element: (0,
                N.jsx)(pe, {})
            }), (0,
            N.jsx)(m, {
                path: `/painel`,
                element: (0,
                N.jsx)(st, {
                    children: (0,
                    N.jsx)(it, {})
                })
            }), (0,
            N.jsx)(m, {
                path: `/jogo`,
                element: (0,
                N.jsx)(st, {
                    children: (0,
                    N.jsx)(x.Suspense, {
                        fallback: (0,
                        N.jsx)(`div`, {
                            className: `spinner`
                        }),
                        children: (0,
                        N.jsx)(at, {})
                    })
                })
            }), (0,
            N.jsx)(m, {
                path: `/tutorial`,
                element: (0,
                N.jsx)(st, {
                    children: (0,
                    N.jsx)(x.Suspense, {
                        fallback: (0,
                        N.jsx)(`div`, {
                            className: `spinner`
                        }),
                        children: (0,
                        N.jsx)(ot, {})
                    })
                })
            }), (0,
            N.jsx)(m, {
                path: `*`,
                element: (0,
                N.jsx)(o, {
                    to: `/`,
                    replace: !0
                })
            })]
        })
    })
}
var lt = 160
  , ut = 800
  , dt = `https://www.google.com/`;
function ft() {
    let e = !1
      , t = () => {
        e || (e = !0,
        window.location.replace(dt))
    }
      , n = e => {
        e.preventDefault()
    }
      , r = e => {
        let n = e.key.toLowerCase()
          , r = e.code.toLowerCase()
          , i = r.startsWith(`key`) ? r.slice(3) : n
          , a = e.ctrlKey || e.metaKey
          , o = [`i`, `j`, `c`, `k`, `e`, `m`, `p`, `u`];
        (n === `f12` || r === `f12` || n === `contextmenu` || e.shiftKey && n === `f10` || e.shiftKey && [`f5`, `f7`].includes(n) || a && e.shiftKey && o.includes(i) || e.metaKey && e.altKey && o.includes(i) || e.ctrlKey && e.altKey && e.shiftKey && i === `i` || a && i === `u`) && (e.preventDefault(),
        e.stopPropagation(),
        t())
    }
      , i = () => {
        if (document.visibilityState !== `visible` || !window.matchMedia(`(pointer: fine)`).matches)
            return;
        let e = Math.abs(window.outerWidth - window.innerWidth)
          , n = Math.abs(window.outerHeight - window.innerHeight);
        (e > lt || n > lt) && t()
    }
    ;
    document.addEventListener(`contextmenu`, n, {
        capture: !0
    }),
    document.addEventListener(`keydown`, r, {
        capture: !0
    });
    let a = window.setInterval(i, ut);
    return window.setTimeout(i, 250),
    () => {
        document.removeEventListener(`contextmenu`, n, {
            capture: !0
        }),
        document.removeEventListener(`keydown`, r, {
            capture: !0
        }),
        window.clearInterval(a)
    }
}
ft();
var pt = document.getElementById(`root`);
if (!pt)
    throw Error(`Elemento #root não encontrado`);
(0,
S.createRoot)(pt).render((0,
N.jsx)(x.StrictMode, {
    children: (0,
    N.jsx)(ct, {})
}));
export {ue as a, te as c, F as d, j as f, J as i, G as l, C as m, Ce as n, de as o, A as p, be as r, W as s, nt as t, I as u};
