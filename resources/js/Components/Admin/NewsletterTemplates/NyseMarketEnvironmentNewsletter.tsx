export const NYSE_NEWSLETTER_WIDTH = 1122;
export const NYSE_NEWSLETTER_HEIGHT = 1402;

export const tickerCards = [
    {
        key: 'spyi',
        symbol: 'SPYI',
        values: {
            price: '$53.16',
            s2: '58.48',
            s1: '55.82',
            b1: '50.50',
            b2: '47.84',
        },
    },
    {
        key: 'qqqi',
        symbol: 'QQQI',
        values: {
            price: '$56.05',
            s2: '61.66',
            s1: '58.85',
            b1: '53.25',
            b2: '50.45',
        },
    },
    {
        key: 'iwmi',
        symbol: 'IWMI',
        values: {
            price: '$50.77',
            s2: '55.85',
            s1: '53.31',
            b1: '48.23',
            b2: '45.69',
        },
    },
    {
        key: 'tltw',
        symbol: 'TLTW',
        values: {
            price: '$21.82',
            s2: '24.00',
            s1: '22.91',
            b1: '20.73',
            b2: '19.64',
        },
    },
] as const;

export const probabilityRows = [
    { key: 'es1', symbol: 'ES1', value: '75% BEARISH' },
    { key: 'nq1', symbol: 'NQ1', value: '80% BEARISH' },
    { key: 'spx', symbol: 'SPX', value: '90% BEARISH' },
    { key: 'qqq', symbol: 'QQQ', value: '85% BEARISH' },
    { key: 'fatmaan', symbol: 'FATMAAN', value: '80% BEARISH' },
    { key: 'svix', symbol: 'SVIX', value: '80% BULLISH' },
    { key: 'dxy', symbol: '-DXY', value: '80% BEARISH' },
] as const;

export type TickerCardKey = (typeof tickerCards)[number]['key'];
export type PriceFieldKey = keyof (typeof tickerCards)[number]['values'];
export type ProbabilityKey = (typeof probabilityRows)[number]['key'];

export type NyseNewsletterValues = {
    date: string;
    cards: Record<TickerCardKey, Record<PriceFieldKey, string>>;
    probabilities: Record<ProbabilityKey, string>;
    marketCommentary: string;
};

export function createDefaultNyseNewsletterValues(): NyseNewsletterValues {
    return {
        date: formatDateInputValue(new Date()),
        cards: tickerCards.reduce(
            (accumulator, card) => ({
                ...accumulator,
                [card.key]: { ...card.values },
            }),
            {} as NyseNewsletterValues['cards'],
        ),
        probabilities: probabilityRows.reduce(
            (accumulator, row) => ({
                ...accumulator,
                [row.key]: row.value,
            }),
            {} as NyseNewsletterValues['probabilities'],
        ),
        marketCommentary:
            "Today's environment remains risk-off, with broad weakness across equities and tech while volatility support continues to firm. Internal participation remains soft, suggesting rallies should be treated cautiously unless breadth improves.\n\nFor tomorrow, traders should stay selective, prioritize structure over impulse, and watch for confirmation before pressing long exposure. Defensive posture remains favored until higher-probability improvement appears across key market internals.",
    };
}

export function formatNewsletterDate(dateValue: string) {
    const dateParts = parseDateInputValue(dateValue);

    if (!dateParts) {
        return '';
    }

    return [
        String(dateParts.month).padStart(2, '0'),
        String(dateParts.day).padStart(2, '0'),
        String(dateParts.year),
    ].join('.');
}

export function formatBulletinNumber(dateValue: string) {
    const dateParts = parseDateInputValue(dateValue);

    if (!dateParts) {
        return 'NO. 0000-000';
    }

    const current = Date.UTC(
        dateParts.year,
        dateParts.month - 1,
        dateParts.day,
    );
    const yearStart = Date.UTC(dateParts.year, 0, 1);
    const dayOfYear = Math.floor((current - yearStart) / 86400000) + 1;

    return `NO. ${dateParts.year}-${String(dayOfYear).padStart(3, '0')}`;
}

export function formatDateInputValue(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

function parseDateInputValue(dateValue: string) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateValue);

    if (!match) {
        return null;
    }

    return {
        year: Number(match[1]),
        month: Number(match[2]),
        day: Number(match[3]),
    };
}

export function NyseMarketEnvironmentNewsletter({
    values,
}: {
    values: NyseNewsletterValues;
}) {
    return (
        <article
            className="nyse-newsletter"
            style={{
                width: NYSE_NEWSLETTER_WIDTH,
                height: NYSE_NEWSLETTER_HEIGHT,
            }}
        >
            <style>{nyseNewsletterCss}</style>
            <div className="nyse-page-rule nyse-page-rule-outer" />
            <div className="nyse-page-rule nyse-page-rule-inner" />

            <header className="nyse-masthead">
                <div className="nyse-exchange-lockup">
                    <img
                        className="nyse-exchange-image"
                        src="/design/assets/images/newsletters/newsletter-new-york.jpg"
                        alt="New York Stock Exchange, New York, NY"
                    />
                </div>

                <div className="nyse-brand-lockup">
                    <img
                        className="nyse-bull-logo"
                        src="/design/assets/images/newsletters/newsletter-bull-logo.jpg"
                        alt=""
                    />
                    <div className="nyse-brand-name">TICKER-TACTIX</div>
                    <div className="nyse-brand-tag">
                        <span />
                        MARKET INTELLIGENCE
                        <span />
                    </div>
                </div>

                <div className="nyse-bulletin">
                    <div className="nyse-bulletin-title">
                        MARKET&nbsp;BULLETIN
                    </div>
                    <strong>{formatBulletinNumber(values.date)}</strong>
                    <span />
                    <div>EST. 2024</div>
                </div>
            </header>

            <h1 className="nyse-title">NYSE ETF ENVIRONMENT</h1>

            <div className="nyse-subtitle">
                <span />
                <i />
                <strong>DAILY NEWSLETTER</strong>
                <i />
                <span />
            </div>

            <div className="nyse-date-row">
                <span />
                <time dateTime={values.date}>
                    {formatNewsletterDate(values.date)}
                </time>
                <span />
            </div>

            <section className="nyse-card-grid" aria-label="Market levels">
                {tickerCards.map((card) => (
                    <MarketCard
                        key={card.key}
                        symbol={card.symbol}
                        values={values.cards[card.key]}
                    />
                ))}
            </section>

            <section className="nyse-lower-grid">
                <ProbabilityPanel values={values.probabilities} />
                <CommentaryPanel commentary={values.marketCommentary} />
            </section>

            <footer className="nyse-footer">
                <img
                    className="nyse-footer-image"
                    src="/design/assets/images/newsletters/newsletter-footer.jpg"
                    alt="Trade with structure, not emotion."
                />
            </footer>
        </article>
    );
}

function MarketCard({
    symbol,
    values,
}: {
    symbol: string;
    values: Record<PriceFieldKey, string>;
}) {
    return (
        <div className="nyse-market-card">
            <div className="nyse-market-symbol">{symbol}</div>
            <div className="nyse-market-price">{values.price}</div>
            <div className="nyse-level-table">
                {levelRows.map((row) => (
                    <div className="nyse-level-row" key={row.key}>
                        <span className={row.tone}>{row.label}</span>
                        <strong>{values[row.key]}</strong>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ProbabilityPanel({
    values,
}: {
    values: NyseNewsletterValues['probabilities'];
}) {
    return (
        <div className="nyse-section-frame nyse-probability-panel">
            <h2>DIRECTIONAL MOMENTUM</h2>
            <div className="nyse-probability-head">
                <span>SYMBOL</span>
                <span>STRENGTH</span>
            </div>
            <div className="nyse-probability-body">
                {probabilityRows.map((row) => {
                    const value = values[row.key];
                    const isBullish = value.toUpperCase().includes('BULLISH');

                    return (
                        <div className="nyse-probability-row" key={row.key}>
                            <span>{row.symbol}</span>
                            <strong
                                className={isBullish ? 'bullish' : 'bearish'}
                            >
                                {value}
                            </strong>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function CommentaryPanel({ commentary }: { commentary: string }) {
    return (
        <div className="nyse-section-frame nyse-commentary-panel">
            <h2>
                <span />
                MOMENTUM COMMENTARY
                <span />
            </h2>
            <p
                style={{
                    fontSize: 'var(--nyse-commentary-font-size)',
                    lineHeight: 'var(--nyse-commentary-line-height)',
                    maxHeight: 'var(--nyse-commentary-max-height)',
                }}
            >
                {commentary}
            </p>
        </div>
    );
}

const levelRows: {
    key: PriceFieldKey;
    label: string;
    tone: string;
}[] = [
    { key: 's2', label: 'S2', tone: 'sell' },
    { key: 's1', label: 'S1', tone: 'sell' },
    { key: 'b1', label: 'B1', tone: 'buy' },
    { key: 'b2', label: 'B2', tone: 'buy' },
];

const nyseNewsletterCss = `
.nyse-newsletter {
    position: relative;
    box-sizing: border-box;
    overflow: hidden;
    padding: 34px 38px 28px;
    --nyse-commentary-font-size: 20px;
    --nyse-commentary-line-height: 1.22;
    --nyse-commentary-max-height: 360px;
    background:
        radial-gradient(circle at 18% 8%, rgba(255, 255, 255, 0.62), transparent 17%),
        radial-gradient(circle at 85% 18%, rgba(89, 64, 32, 0.08), transparent 24%),
        radial-gradient(circle at 50% 74%, rgba(42, 48, 36, 0.07), transparent 32%),
        repeating-linear-gradient(35deg, rgba(35, 31, 23, 0.022) 0, rgba(35, 31, 23, 0.022) 1px, transparent 1px, transparent 5px),
        #e4d8c2;
    color: #11130f;
    font-family: Georgia, "Times New Roman", serif;
    letter-spacing: 0;
}

.nyse-newsletter *,
.nyse-newsletter *::before,
.nyse-newsletter *::after {
    box-sizing: border-box;
}

.nyse-page-rule {
    position: absolute;
    inset: 8px;
    border: 2px solid rgba(22, 29, 21, 0.86);
    pointer-events: none;
}

.nyse-page-rule-inner {
    inset: 15px;
    border-width: 1px;
}

.nyse-masthead {
    display: grid;
    grid-template-columns: 236px 1fr 222px;
    align-items: start;
    gap: 18px;
    min-height: 166px;
}

.nyse-exchange-lockup {
    padding-left: 7px;
}

.nyse-exchange-image {
    display: block;
    width: 170px;
    height: 154px;
    object-fit: contain;
    mix-blend-mode: darken;
}

.nyse-exchange-sketch {
    position: relative;
    width: 162px;
    height: 126px;
    filter: sepia(0.55) contrast(1.05);
    opacity: 0.82;
}

.nyse-exchange-roof {
    position: absolute;
    top: 4px;
    left: 8px;
    width: 150px;
    height: 43px;
    border: 4px solid #23241d;
    border-bottom-width: 7px;
    transform: skewY(10deg);
}

.nyse-exchange-roof::before,
.nyse-exchange-roof::after {
    content: "";
    position: absolute;
    border-top: 2px solid #23241d;
    opacity: 0.7;
}

.nyse-exchange-roof::before {
    top: 10px;
    right: 8px;
    left: 8px;
}

.nyse-exchange-roof::after {
    top: 22px;
    right: 13px;
    left: 13px;
}

.nyse-exchange-roof span {
    position: absolute;
    top: 9px;
    width: 34px;
    height: 19px;
    border: 2px solid #23241d;
    transform: skewX(-22deg);
}

.nyse-exchange-roof span:nth-child(1) {
    left: 12px;
}

.nyse-exchange-roof span:nth-child(2) {
    left: 55px;
}

.nyse-exchange-roof span:nth-child(3) {
    left: 98px;
}

.nyse-exchange-frieze {
    position: absolute;
    top: 49px;
    left: 11px;
    width: 151px;
    height: 14px;
    border-top: 4px solid #23241d;
    border-bottom: 2px solid #23241d;
    transform: skewY(10deg);
}

.nyse-exchange-columns {
    position: absolute;
    top: 62px;
    left: 12px;
    display: flex;
    width: 150px;
    height: 74px;
    justify-content: space-between;
    padding: 0 9px;
    border-bottom: 5px solid #23241d;
    transform: skewY(10deg);
}

.nyse-exchange-columns i {
    width: 10px;
    height: 70px;
    border-right: 2px solid #23241d;
    border-left: 2px solid #23241d;
    background: repeating-linear-gradient(90deg, transparent 0, transparent 2px, rgba(35, 36, 29, 0.6) 2px, rgba(35, 36, 29, 0.6) 3px);
}

.nyse-exchange-steps {
    position: absolute;
    right: 4px;
    bottom: 0;
    left: 2px;
    height: 14px;
    border-top: 4px solid #23241d;
    border-bottom: 2px solid #23241d;
}

.nyse-location {
    margin-top: 3px;
    padding-left: 31px;
    color: #171812;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 2.5px;
}

.nyse-brand-lockup {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 2px;
}

.nyse-bull-logo {
    display: block;
    width: 86px;
    height: 86px;
    object-fit: contain;
    mix-blend-mode: darken;
}

.nyse-bull-seal {
    position: relative;
    width: 86px;
    height: 86px;
    border: 3px solid #102d22;
    border-radius: 50%;
    box-shadow: inset 0 0 0 4px rgba(16, 45, 34, 0.12);
}

.nyse-bull {
    position: absolute;
    top: 28px;
    left: 20px;
    width: 47px;
    height: 32px;
}

.nyse-bull span {
    position: absolute;
    display: block;
    background: #102d22;
}

.nyse-bull-body {
    top: 8px;
    left: 4px;
    width: 38px;
    height: 18px;
    border-radius: 45% 44% 36% 30%;
}

.nyse-bull-head {
    top: 4px;
    right: 0;
    width: 15px;
    height: 13px;
    border-radius: 45% 35% 45% 35%;
    transform: rotate(-9deg);
}

.nyse-bull-horn {
    top: 0;
    width: 10px;
    height: 3px;
    border-radius: 20px;
    transform-origin: right center;
}

.nyse-bull-horn-left {
    right: 3px;
    transform: rotate(-36deg);
}

.nyse-bull-horn-right {
    right: -4px;
    transform: rotate(21deg);
}

.nyse-bull-tail {
    top: 8px;
    left: 0;
    width: 12px;
    height: 3px;
    border-radius: 8px;
    transform: rotate(-26deg);
}

.nyse-bull-leg {
    top: 22px;
    width: 4px;
    height: 11px;
    border-radius: 1px;
}

.nyse-bull-leg-one {
    left: 9px;
}

.nyse-bull-leg-two {
    left: 18px;
}

.nyse-bull-leg-three {
    left: 31px;
}

.nyse-bull-leg-four {
    left: 39px;
}

.nyse-brand-name {
    margin-top: 21px;
    color: #10130f;
    font-size: 43px;
    font-weight: 700;
    line-height: 1;
    letter-spacing: 8px;
}

.nyse-brand-tag {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 6px;
    color: #1d1d17;
    font-size: 18px;
    font-weight: 700;
    letter-spacing: 6px;
}

.nyse-brand-tag span {
    width: 75px;
    border-top: 1px solid #1d1d17;
}

.nyse-bulletin {
    width: 222px;
    height: 122px;
    overflow: hidden;
    padding: 15px 12px 12px;
    border: 2px solid #20231b;
    text-align: center;
    color: #191a14;
    font-size: 14px;
    font-weight: 700;
    line-height: 1.3;
    letter-spacing: 3.2px;
}

.nyse-bulletin-title {
    font-size: 14px;
}

.nyse-bulletin strong {
    display: block;
    margin-top: 5px;
    font-size: 14px;
    letter-spacing: 3.2px;
}

.nyse-bulletin span {
    display: block;
    width: 128px;
    margin: 14px auto 10px;
    border-top: 1px solid rgba(31, 34, 28, 0.62);
}

.nyse-title {
    margin: 6px 0 0;
    text-align: center;
    color: #080907;
    font-size: 62px;
    font-weight: 900;
    line-height: 1;
    letter-spacing: 0;
    white-space: nowrap;
}

.nyse-subtitle {
    display: grid;
    grid-template-columns: 1fr 10px auto 10px 1fr;
    align-items: center;
    gap: 28px;
    margin-top: 28px;
}

.nyse-subtitle span {
    border-top: 2px solid #1f261d;
}

.nyse-subtitle i {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: #153528;
}

.nyse-subtitle strong {
    color: #143428;
    font-size: 39px;
    font-weight: 800;
    line-height: 1;
    letter-spacing: 17px;
    white-space: nowrap;
}

.nyse-date-row {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 9px;
    margin-top: 26px;
}

.nyse-date-row span {
    border-top: 4px double #183429;
}

.nyse-date-row time {
    display: block;
    min-width: 354px;
    padding: 9px 42px 8px;
    background: #132f23;
    color: #f5efe3;
    text-align: center;
    font-size: 33px;
    font-weight: 700;
    line-height: 1;
    letter-spacing: 10px;
}

.nyse-card-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 21px;
    margin-top: 23px;
}

.nyse-market-card {
    position: relative;
    height: 315px;
    padding: 10px 11px 13px;
    border: 2px solid #22271e;
    background: rgba(248, 243, 232, 0.42);
    clip-path: polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px);
}

.nyse-market-card::after {
    content: "";
    position: absolute;
    inset: 9px;
    border: 1px solid rgba(28, 31, 24, 0.2);
    pointer-events: none;
}

.nyse-market-symbol {
    position: relative;
    z-index: 1;
    height: 61px;
    background: #143428;
    color: #f7f0e4;
    text-align: center;
    font-size: 45px;
    font-weight: 900;
    line-height: 61px;
    letter-spacing: 5px;
}

.nyse-market-price {
    position: relative;
    z-index: 1;
    margin-top: 11px;
    color: #090a08;
    text-align: center;
    font-size: 32px;
    font-weight: 800;
    line-height: 1.2;
    letter-spacing: 1px;
}

.nyse-level-table {
    position: relative;
    z-index: 1;
    margin: 10px 1px 0;
    border-top: 1px solid rgba(24, 26, 20, 0.74);
}

.nyse-level-row {
    display: grid;
    grid-template-columns: 86px 1fr;
    align-items: center;
    min-height: 44px;
    border-bottom: 1px solid rgba(24, 26, 20, 0.45);
    font-size: 24px;
    font-weight: 700;
}

.nyse-level-row span {
    padding-left: 22px;
    letter-spacing: 2px;
}

.nyse-level-row strong {
    padding-right: 23px;
    text-align: right;
    font-weight: 600;
    letter-spacing: 1px;
}

.nyse-level-row .sell {
    color: #7c1824;
}

.nyse-level-row .buy {
    color: #17382a;
}

.nyse-lower-grid {
    display: grid;
    grid-template-columns: minmax(0, 47.7%) minmax(0, 1fr);
    gap: 27px;
    margin-top: 28px;
}

.nyse-section-frame {
    position: relative;
    min-width: 0;
    min-height: 452px;
    overflow: hidden;
    border: 2px solid #22271e;
    background: rgba(248, 243, 232, 0.42);
    clip-path: polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px);
}

.nyse-probability-panel {
    padding: 8px 10px 16px;
}

.nyse-probability-panel h2 {
    margin: 0;
    height: 46px;
    background: #143428;
    color: #f7f0e4;
    text-align: center;
    font-size: 20px;
    font-weight: 900;
    line-height: 46px;
    letter-spacing: 3px;
}

.nyse-probability-head {
    display: grid;
    grid-template-columns: 174px 1fr;
    min-height: 44px;
    border-right: 1px solid rgba(24, 26, 20, 0.52);
    border-bottom: 2px solid #1f211a;
    border-left: 1px solid rgba(24, 26, 20, 0.52);
}

.nyse-probability-head span {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 2px;
    font-size: 16px;
    font-weight: 900;
    letter-spacing: 1px;
}

.nyse-probability-head span:first-child,
.nyse-probability-row span:first-child {
    border-right: 1px solid rgba(24, 26, 20, 0.48);
}

.nyse-probability-row {
    display: grid;
    grid-template-columns: 174px 1fr;
    min-height: 45px;
    border-bottom: 1px dashed rgba(24, 26, 20, 0.42);
}

.nyse-probability-row span,
.nyse-probability-row strong {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 26px;
    font-weight: 900;
    line-height: 1;
}

.nyse-probability-row strong {
    font-size: 22px;
    letter-spacing: 1px;
}

.nyse-probability-row strong.bearish {
    color: #7d1c28;
}

.nyse-probability-row strong.bullish {
    color: #153b2d;
}

.nyse-commentary-panel {
    padding: 20px 22px;
}

.nyse-commentary-panel h2 {
    display: grid;
    grid-template-columns: 64px minmax(0, 1fr) 64px;
    align-items: center;
    gap: 13px;
    margin: 0 0 21px;
    color: #183428;
    text-align: center;
    font-size: 18px;
    font-weight: 900;
    line-height: 1;
    letter-spacing: 2.2px;
    white-space: nowrap;
}

.nyse-commentary-panel h2 span {
    border-top: 2px solid #1f211a;
}

.nyse-commentary-panel p {
    margin: 0;
    padding-top: 10px;
    overflow: hidden;
    color: #11130f;
    font-weight: 500;
    overflow-wrap: break-word;
    white-space: pre-line;
}

.nyse-footer {
    margin-top: 17px;
}

.nyse-footer-image {
    display: block;
    width: 100%;
    height: auto;
    object-fit: contain;
    mix-blend-mode: darken;
}

.nyse-footer-rail {
    display: grid;
    grid-template-columns: 1fr 122px 1fr;
    align-items: center;
    gap: 22px;
}

.nyse-footer-rail > span {
    border-top: 5px double #173428;
}

.nyse-wall-mark {
    position: relative;
    height: 49px;
}

.nyse-wall-buildings {
    position: absolute;
    top: 3px;
    left: 0;
    display: flex;
    align-items: end;
    gap: 3px;
}

.nyse-wall-buildings span {
    display: block;
    width: 18px;
    border: 2px solid #22271e;
    background: repeating-linear-gradient(90deg, #22271e 0, #22271e 2px, transparent 2px, transparent 6px);
}

.nyse-wall-buildings span:first-child {
    height: 43px;
    clip-path: polygon(50% 0, 100% 20%, 100% 100%, 0 100%, 0 20%);
}

.nyse-wall-buildings span:last-child {
    height: 35px;
    clip-path: polygon(50% 0, 100% 24%, 100% 100%, 0 100%, 0 24%);
}

.nyse-wall-sign {
    position: absolute;
    top: 11px;
    left: 34px;
    width: 76px;
    height: 29px;
    transform: rotate(-5deg);
    border: 2px solid #22271e;
    background: #24312b;
    color: #f6f0e7;
    text-align: center;
    font-family: Arial, sans-serif;
    font-size: 18px;
    font-weight: 900;
    line-height: 25px;
    letter-spacing: 1px;
}

.nyse-footer-slogan {
    display: grid;
    grid-template-columns: 50px 1fr 50px;
    align-items: center;
    margin-top: 9px;
}

.nyse-footer-slogan b {
    position: relative;
    width: 23px;
    height: 23px;
    justify-self: center;
    transform: rotate(45deg);
}

.nyse-footer-slogan b::before,
.nyse-footer-slogan b::after {
    content: "";
    position: absolute;
    background: #5a4d35;
}

.nyse-footer-slogan b::before {
    top: 9px;
    left: 0;
    width: 23px;
    height: 5px;
}

.nyse-footer-slogan b::after {
    top: 0;
    left: 9px;
    width: 5px;
    height: 23px;
}

.nyse-footer-slogan strong {
    color: #11120f;
    text-align: center;
    font-size: 39px;
    font-weight: 900;
    line-height: 1;
    letter-spacing: 6px;
}

.nyse-footer-slogan em {
    color: #16372a;
    font-style: normal;
    letter-spacing: 8px;
}

.nyse-footer-slogan mark {
    background: transparent;
    color: #7c1724;
}
`;
