<?php

return [
    'modules' => [
        [
            'title' => 'Momentum Cycles',
            'description' => 'Measures directional momentum phase and trend strength, helping identify when conditions are aligned bullish or bearish.',
            'trader_types' => 'NYSE BASE; NYSE CORE; NYSE PRO; CRYPTO CORE; CRYPTO PRO',
            'market' => 'All',
            'version' => 'v1.33',
            'access' => 'Invite-Only Indicator + Discord',
            'action_url' => null,
            'price' => '50.0',
            'purpose' => 'Direction',
            'layer' => 'Classification Layer',
            'long_name' => 'Ticker-Tactix Momentum Cycles',
            'short_name' => 'T-T:MC',
            'trading_pace' => 'ALL',
            'key_output' => 'Momentum Phase',
            'short_description' => null,
            'long_description' => 'Ticker-Tactix Momentum Cycles (T-T:MC) translates raw market motion into an elegant visual language of acceleration, deceleration, and reversal.

By blending short and medium-term velocity measurements, it forms a momentum map that highlights the balance between force and direction inside every trend. Each cycle is rendered through adaptive color transitions, cross markers, and optional background shifts that make changes in market energy unmistakable at a glance.
',
            'core_features' => 'Signal Line – The heart of the indicator, capturing real-time changes in price strength and directional bias.
• Momentum Line – A smoothed trail of recent momentum, providing structure and flow to the cycles.
• Histogram Display – Visualizes bullish & bearish phases, color-coded to distinguish rising and fading energy in both bullish and bearish zones.
• Dynamic Background – Optional shading reacts instantly to the prevailing momentum phase for immediate trend context.',
            'customization_options' => '• Toggle visibility of lines, histogram, dots, and background for a clean or detailed look.
• Works across all symbols and timeframes.
',
            'best_used_for' => '• Identifying early momentum shifts before trend confirmation.
• Visualizing cycle transitions to refine entry and exit timing.
• Enhancing multi-timeframe confluence and directional confidence.',
            'summary' => 'Ticker-Tactix Momentum Cycles gives traders a visual framework to sense the rhythm of price action — transforming market noise into a readable cycle of strength and release.
',
            'icon' => 'momentum-cycles',
            'is_active' => false,
        ],
        [
            'title' => 'Sequence Pressure',
            'description' => 'Tracks directional exhaustion and pressure buildup to help identify when a move may be weakening or becoming vulnerable to recoil.',
            'trader_types' => 'NYSE BASE; NYSE CORE; NYSE PRO; CRYPTO CORE; CRYPTO PRO',
            'market' => 'All',
            'version' => 'v1.44',
            'access' => 'Invite-Only Indicator + Discord',
            'action_url' => 'https://buy.stripe.com/4gMeVd7a0d2G97Y12U28801',
            'price' => '50.0',
            'purpose' => 'Direction',
            'layer' => 'Classification Layer',
            'long_name' => 'Ticker-Tactix Sequence Pressure',
            'short_name' => 'T-T:Pressure',
            'trading_pace' => 'ALL',
            'key_output' => 'Exhaustion State',
            'short_description' => 'Ticker-Tactix Sequence Pressure is a precision timing module designed to detect when directional moves have reached structural maturity.',
            'long_description' => 'Ticker-Tactix Sequence Pressure (T-T:Pressure) is a precision timing instrument built around one of the market’s most quietly respected exhaustion rhythms.

Instead of measuring velocity or trend strength, Sequence Pressure  focuses on structural pressure inside price itself — tracking when a move has quietly fulfilled its internal sequence and is statistically vulnerable to reaction. The result is a minimalist set of signals that appear only when the market reaches a true state of imbalance.

No noise. No over plotting. Just high-impact moments.',
            'core_features' => '• Warnings – Early exhaustion signals as pressure builds.
• Triggers – Full sequence completion markers where reactions often ignite.
• Dual-Side Detection – Tracks both bullish and bearish sequences in parallel.
• Chart-Native Labels – Clean numeric markers printed directly on price.',
            'customization_options' => '• Toggle Buy & Sell sequences independently.
• Optional label visibility for clean or detailed chart views.
• Full alert support for automated monitoring.',
            'best_used_for' => '• Identifying trend fatigue before reversals become obvious.
• Timing pullback entries inside extended moves.
• Spotting exhaustion during parabolic expansions.
• Enhancing confluence with momentum, VWAP, or key levels.',
            'summary' => 'Ticker-Tactix Sequence Pressure doesn’t chase momentum — it waits for it to run out of room.
Simple on the surface. Dangerous in the right hands.
',
            'icon' => 'sequence-pressure',
            'is_active' => true,
        ],
        [
            'title' => 'Trend Tracer',
            'description' => 'Maps broader directional flow and trend posture to help determine whether market structure is supporting continuation or deterioration.',
            'trader_types' => 'NYSE PRO',
            'market' => 'NYSE',
            'version' => 'v1.2',
            'access' => 'Invite-Only Indicator + Discord',
            'action_url' => null,
            'price' => '20.0',
            'purpose' => 'Direction',
            'layer' => 'Participation & Flow Layer',
            'long_name' => 'Ticker-Tactix Trend Tracer',
            'short_name' => 'T-T:TT',
            'trading_pace' => 'DAY TRADING',
            'key_output' => 'Trend Bias',
            'short_description' => 'Ticker-Tactix Trend Tracer (T-T:TT) converts intraday breadth into a structured, time-based trend narrative.

Trend Tracer tracks overall strength from the prior close through fixed intraday checkpoints, normalizing each move against historical breadth ranges to separate real trend from noise.',
            'long_description' => 'Ticker-Tactix Trend Tracer (T-T:TT) is a precision intraday breadth-mapping tool built to answer one critical question: Is the market actually trending… or just moving?

It systematically tracks ADD (Advance-Decline) behavior from the prior session close through every key intraday checkpoint, converting raw breadth data into a structured, time-based trend narrative you can trust.

No interpretation. No hindsight. Just verified progression.
',
            'core_features' => '• Anchors to Yesterday’s Close (15:59 ET)
Establishes a true baseline before today’s session begins — eliminating overnight distortion.
• Tracks ADD at Fixed Intraday Intervals
Measures ADD at precise, repeatable checkpoints starting minutes after the open and continuing every 30 minutes through the close.
• Quantifies Momentum, Not Just Direction
Each reading is compared to the prior checkpoint, revealing whether breadth is accelerating, stalling, or reversing.
• Normalizes Movement Using ADR (14)
Breadth deltas are expressed as a percentage of ADD’s 14-session average range — so you know whether a move is meaningful or just noise.
• Session-Aware, Time-Zone Safe
All readings are anchored to market time, not chart time, and displayed cleanly in your preferred local time zone.
• Visual Confirmation on Chart
Optional source markers print exactly when each breadth reading occurs — no guessing, no misalignment.',
            'customization_options' => '• Whether an early push has real follow-through
• When breadth expansion is weakening before price reacts
• If trend continuation is being earned or fading
• When late-day moves are supported… or hollow
This is how you separate trend days from chop days in real time.',
            'best_used_for' => '• Index & futures traders validating trend strength
• Options traders deciding when conviction deserves size
• Day traders filtering fake continuation
• Swing traders identifying institutional follow-through',
            'summary' => 'T-T:Trend Tracer doesn’t call the move.
It tells you whether the market is actually backing it.
When breadth confirms, you press. When it doesn’t, you protect. That’s the edge.
',
            'icon' => 'trend-tracer',
            'is_active' => true,
        ],
        [
            'title' => 'Crypto Velocity Stats',
            'description' => 'Measures short-term crypto momentum statistics and directional acceleration across the selected asset and timeframe.',
            'trader_types' => 'CRYPTO PRO',
            'market' => 'Crypto',
            'version' => '1.14',
            'access' => 'Invite-Only Indicator + Discord',
            'action_url' => null,
            'price' => '20.0',
            'purpose' => 'Direction',
            'layer' => 'Participation & Flow Layer',
            'long_name' => 'Ticker-Tactix Crypto Velocity Stats',
            'short_name' => 'T-T:CVS',
            'trading_pace' => 'DAY TRADING',
            'key_output' => 'Velocity Profile',
            'short_description' => null,
            'long_description' => 'Ticker-Tactix Crypto Velocity Stats (T-T:CVS) is a precision intraday momentum-mapping tool built to answer one critical question: Is crypto actually accelerating… or just fluctuating?

It systematically tracks short-term directional movement across the selected crypto asset and timeframe, converting raw price behavior into a structured velocity narrative you can trust.

No guesswork. No hindsight. Just verified velocity.',
            'core_features' => '• Anchors Momentum to Structured Time-Based Readings
Measures crypto movement at precise, repeatable intervals so momentum can be evaluated through progression, not emotion.
• Tracks Velocity at Fixed Intraday Checkpoints
Monitors how price is advancing or deteriorating across each measurement window, building a clean sequence of momentum development throughout the session.
• Quantifies Acceleration, Not Just Direction
Each reading is compared to the prior reading, revealing whether momentum is expanding, fading, or reversing beneath the surface.
• Converts Raw Movement into Structured Statistics
Transforms price behavior into a readable velocity framework so traders can distinguish meaningful expansion from random fluctuation.
• Built for 24/7 Crypto Conditions
Designed specifically for crypto markets, where momentum can build, persist, and fail outside traditional market hours.
• Visual Confirmation on Chart
Displays momentum statistics cleanly on chart so traders can evaluate current velocity without relying on subjective interpretation.',
            'customization_options' => null,
            'best_used_for' => '• Crypto traders evaluating short-term momentum quality
• Intraday traders identifying expansion before it becomes obvious
• Traders filtering weak continuation and low-quality breakouts
• Momentum-focused traders who want structure behind acceleration',
            'summary' => null,
            'icon' => 'volatility-pulse',
            'is_active' => true,
        ],
        [
            'title' => 'Info Box',
            'description' => 'Displays a compact market HUD with key breadth, futures, ticker, range, and volume context for fast decision support.',
            'trader_types' => 'NYSE PRO',
            'market' => 'NYSE',
            'version' => 'v1.28',
            'access' => 'Invite-Only Indicator + Discord',
            'action_url' => null,
            'price' => '50.0',
            'purpose' => 'HUD',
            'layer' => 'Participation & Flow Layer',
            'long_name' => 'Ticker-Tactix Info Box',
            'short_name' => 'T-T:InfoBox',
            'trading_pace' => 'DAY TRADING',
            'key_output' => 'Market Context Panel',
            'short_description' => null,
            'long_description' => 'Ticker-Tactix Info Box (T-T:InfoBox) is a precision-built market intelligence HUD designed for traders who don’t guess — they confirm.

It quietly overlays your chart with the most important forces moving the tape: breadth, index alignment, volatility pressure, participation strength, and real-time capital flow from the stocks that actually move the world.

No clutter. No noise. Just instant context where it matters most — at the moment of decision.',
            'core_features' => '• Market Internals (ADD + ADDQ) – Know immediately if the market is being carried by a few names… or lifted by real participation.
• Index Confirmation (ES + NQ) – Instantly spot alignment, stall, or divergence between the engines of price.
• FATMAAN Power Flow – Live composite behavior of META, AAPL, TSLA, MSFT, AMZN, GOOGL & NVDA— the stocks that bend the market around them.
• Volatility Pressure – Real-time expansion context so you know when energy is building… or fading.
• Participation Strength – Volume displayed with instant session context vs normal conditions.
• Live Ticker Readout – Your active symbol’s performance is always in view.
• Directional Bias Arrows – Quick visual tells without thinking.',
            'customization_options' => 'T-T:InfoBox doesn’t compete with your chart.
It sits beside it like a co-pilot — feeding you what most traders only realize after the move.
No digging through panels.
No bouncing between dashboards.
Your market truth is always one glance away.',
            'best_used_for' => '• Futures & options traders who demand confirmation before size
• Scalpers who thrive on alignment and velocity
• Day traders filtering fake breakouts vs real expansion
• Swing traders timing entries with institutional participation
',
            'summary' => 'T-T:InfoBox doesn’t predict. It positions you where prediction isn’t necessary.
When the market speaks…you’ll already be listening.
',
            'icon' => 'info-box',
            'is_active' => true,
        ],
        [
            'title' => 'Info Line',
            'description' => 'Displays the same decision-support context as Info Box in a condensed horizontal format for users who prefer a streamlined HUD.',
            'trader_types' => 'NYSE PRO',
            'market' => 'NYSE',
            'version' => 'v1.28',
            'access' => 'Invite-Only Indicator + Discord',
            'action_url' => null,
            'price' => '50.0',
            'purpose' => 'HUD',
            'layer' => 'Participation & Flow Layer',
            'long_name' => 'Ticker-Tactix Info Line',
            'short_name' => 'T-T:InfoLine',
            'trading_pace' => 'DAY TRADING',
            'key_output' => 'Market Context Line',
            'short_description' => null,
            'long_description' => 'Ticker-Tactix Info Line (T-T:InfoLine) is a precision-built market intelligence HUD designed for traders who don’t guess — they confirm.

It quietly overlays your chart with the most important forces moving the tape: breadth, index alignment, volatility pressure, participation strength, and real-time capital flow from the stocks that actually move the world.

No clutter. No noise. Just instant context where it matters most — at the moment of decision.',
            'core_features' => '• Market Internals (ADD + ADDQ) – Know immediately if the market is being carried by a few names… or lifted by real participation.
• Index Confirmation (ES + NQ) – Instantly spot alignment, stall, or divergence between the engines of price.
• FATMAAN Power Flow – Live composite behavior of META, AAPL, TSLA, MSFT, AMZN, GOOGL & NVDA— the stocks that bend the market around them.
• Volatility Pressure – Real-time expansion context so you know when energy is building… or fading.
• Participation Strength – Volume displayed with instant session context vs normal conditions.
• Live Ticker Readout – Your active symbol’s performance is always in view.
• Directional Bias Arrows – Quick visual tells without thinking.',
            'customization_options' => 'T-T:InfoLine doesn’t compete with your chart.
It sits beside it like a co-pilot — feeding you what most traders only realize after the move.
No digging through panels.
No bouncing between dashboards.
Your market truth is always one glance away.',
            'best_used_for' => '• Futures & options traders who demand confirmation before size
• Scalpers who thrive on alignment and velocity
• Day traders filtering fake breakouts vs real expansion
• Swing traders timing entries with institutional participation
',
            'summary' => 'T-T:InfoLine doesn’t predict. It positions you where prediction isn’t necessary.
When the market speaks…you’ll already be listening.
',
            'icon' => 'info-box',
            'is_active' => true,
        ],
        [
            'title' => 'Crypto Info Box',
            'description' => 'Displays a crypto-specific HUD with market-cap, BTC futures, stablecoin dominance, ticker, range, and volume context.',
            'trader_types' => 'CRYPTO PRO',
            'market' => 'Crypto',
            'version' => 'v1.49',
            'access' => 'Invite-Only Indicator + Discord',
            'action_url' => 'https://buy.stripe.com/9B600j65W6Eidoeh1S28804',
            'price' => '50.0',
            'purpose' => 'HUD',
            'layer' => 'Participation & Flow Layer',
            'long_name' => 'Ticker-Tactix Crypto Info Box',
            'short_name' => 'T-T:CryptoInfoBox',
            'trading_pace' => 'DAY TRADING',
            'key_output' => 'Crypto Context Panel',
            'short_description' => 'Ticker-Tactix Crypto Info Box is a precision-built market intelligence HUD for crypto traders who don’t guess, they confirm.',
            'long_description' => 'Ticker-Tactix Crypto Info Box is a precision-built market intelligence HUD for traders who don’t guess, they confirm.

Info Box overlays your chart with the forces that actually move the market: breadth, index alignment, volatility pressure, participation, and capital flow — without clutter or distraction.',
            'core_features' => 'Market internals
BTC alignment
Crypto Top 8 power flow
Volatility and participation context
Directional bias arrows
Keeps you aligned with crypto market structure
Eliminates dashboard hopping',
            'customization_options' => 'Text output sizing
Positioning and display toggles
Symbol-aware live updates',
            'best_used_for' => 'Instant confirmation before committing size
Clarity during fast decision windows
Acts as a co-pilot, not a replacement
Always visible, never intrusive',
            'summary' => null,
            'icon' => 'crypto-info-box',
            'is_active' => true,
        ],
        [
            'title' => 'Crypto Info Line',
            'description' => 'Displays the same crypto-specific context as Crypto Info Box in a compressed horizontal format for streamlined chart viewing.',
            'trader_types' => 'CRYPTO PRO',
            'market' => 'Crypto',
            'version' => 'v1.49',
            'access' => 'Invite-Only Indicator + Discord',
            'action_url' => 'https://buy.stripe.com/9B600j65W6Eidoeh1S28804',
            'price' => '50.0',
            'purpose' => 'HUD',
            'layer' => 'Participation & Flow Layer',
            'long_name' => 'Ticker-Tactix Crypto Info Line',
            'short_name' => 'T-T:CryptoInfoLine',
            'trading_pace' => 'DAY TRADING',
            'key_output' => 'Crypto Contect Line',
            'short_description' => 'Ticker-Tactix Crypto Info Line is a precision-built market intelligence HUD for crypto traders who don’t guess, they confirm.',
            'long_description' => 'Ticker-Tactix Crypto Info Line is a precision-built market intelligence HUD for traders who don’t guess, they confirm.

Info Line overlays your chart with the forces that actually move the market: breadth, index alignment, volatility pressure, participation, and capital flow — without clutter or distraction.',
            'core_features' => 'Market internals
BTC alignment
Crypto Top 8 power flow
Volatility and participation context
Directional bias arrows
Keeps you aligned with crypto market structure
Eliminates dashboard hopping',
            'customization_options' => 'Text output sizing
Positioning and display toggles
Symbol-aware live updates',
            'best_used_for' => 'Instant confirmation before committing size
Clarity during fast decision windows
Acts as a co-pilot, not a replacement
Always visible, never intrusive',
            'summary' => null,
            'icon' => 'crypto-info-box',
            'is_active' => true,
        ],
        [
            'title' => 'Pulse',
            'description' => 'Measures participation quality and internal market flow to help confirm whether price movement is being supported by real engagement.',
            'trader_types' => 'NYSE PRO; CRYPTO PRO',
            'market' => 'All',
            'version' => 'v1.32',
            'access' => 'Invite-Only Indicator + Discord',
            'action_url' => null,
            'price' => '50.0',
            'purpose' => 'Direction',
            'layer' => 'Participation & Flow Layer',
            'long_name' => 'Ticker-Tactix Pulse',
            'short_name' => 'T-T:Pulse',
            'trading_pace' => 'DAY TRADING',
            'key_output' => 'Participation Scale',
            'short_description' => 'Ticker-Tactix Pulse (T-T:Pulse) shows the market’s heartbeat by converting raw ticks into custom candles. Each “Pulse” candle forms after a set number of trades, revealing price flow and volume activity that normal time-based charts overlook.',
            'long_description' => 'Ticker-Tactix Pulse gives traders a new way to see what’s really happening inside each move.
Instead of building candles by time, Pulse creates them from a fixed number of ticks—so every candle represents equal trading activity, not equal minutes. This design exposes subtle shifts in momentum, strength, and participation as they happen.',
            'core_features' => '• Builds OHLC candles from a custom tick count
• Displays real-time volume for every pulse
• Colors price bodies, wicks, and volume bars for clear directional feedback
• Calculates current, minimum, maximum, and average volume values automatically',
            'customization_options' => null,
            'best_used_for' => '• To study market rhythm and volume flow in greater detail
• To spot exhaustion, breakout momentum, or reversal pulses
• To analyze movement independently of the clock',
            'summary' => 'Ticker-Tactix Pulse is ideal for traders who want a clearer picture of how each burst of trading energy drives price—capturing the true pulse of the market in real time.',
            'icon' => 'pulse',
            'is_active' => false,
        ],
        [
            'title' => 'Tide',
            'description' => 'Tracks broader market current and directional flow to help determine whether participation is supportive, fading, or shifting.',
            'trader_types' => 'NYSE PRO; CRYPTO PRO',
            'market' => 'All',
            'version' => 'v1.6',
            'access' => 'Invite-Only Indicator + Discord',
            'action_url' => null,
            'price' => '15.0',
            'purpose' => 'Breadth Cue',
            'layer' => 'Participation & Flow Layer',
            'long_name' => 'Ticker-Tactix Tide',
            'short_name' => 'T-T:Tide',
            'trading_pace' => 'DAY TRADING',
            'key_output' => 'Flow State',
            'short_description' => null,
            'long_description' => null,
            'core_features' => null,
            'customization_options' => null,
            'best_used_for' => null,
            'summary' => null,
            'icon' => 'participation-network',
            'is_active' => false,
        ],
        [
            'title' => 'Range Rails',
            'description' => 'Maps expected range structure and buy/sell rails to help identify where price is stretched, reactive, or positioned for expansion.',
            'trader_types' => 'NYSE PRO; CRYPTO PRO',
            'market' => 'All',
            'version' => 'v1.20',
            'access' => 'Invite-Only Indicator + Discord',
            'action_url' => 'https://buy.stripe.com/8x200jcuk0fU2JA7ri28803',
            'price' => '50.0',
            'purpose' => 'Levels',
            'layer' => 'Volatility & Structure Layer',
            'long_name' => 'Ticker-Tactix Range Rails',
            'short_name' => 'T-T:RangeRails',
            'trading_pace' => 'DAY TRADING',
            'key_output' => 'Rail Zones',
            'short_description' => 'Ticker-Tactix Range Rails is a range-structure module built to help traders understand where price is trading relative to both expected value and intraday expansion zones.',
            'long_description' => 'Ticker-Tactix Range Rails (T-T:Range Rails) is a range-structure module built to help traders understand where price is trading relative to both expected value and intraday expansion zones.

At its core, the tool uses a proprietary calculation to define a broader fair-price area, then overlays live buy and sell rails that map where price is stretching beyond that balance during the current session.

This creates a cleaner decision framework for traders who want to understand:
where price is balanced
where price is extended
where opportunity may begin to improve
and when the market is moving beyond its normal rhythm',
            'core_features' => 'Expected Range Box based on proprietary calculations
Live Buy Rails for downside expansion zones
Live Sell Rails for upside expansion zones
Session-aware updates as price evolves throughout the day
Clear labels and zone visualization for fast decision support
',
            'customization_options' => '• Adjust vertical marker colors, styles, and trigger thresholds.
• Toggle rangerails and labels for minimal or detailed chart views.
',
            'best_used_for' => 'intraday structure analysis
identifying buy and sell opportunity zones
monitoring expansion away from fair price
combining with momentum tools for better execution timing
',
            'summary' => 'Ticker-Tactix Range Rails gives structure to the session by separating fair price from actionable expansion.
',
            'icon' => 'range-rails',
            'is_active' => true,
        ],
        [
            'title' => 'AAVWAP',
            'description' => 'Anchors price to a meaningful reference point to show whether price is holding above or below an important value area.',
            'trader_types' => 'NYSE PRO; CRYPTO PRO',
            'market' => 'All',
            'version' => 'v1.143',
            'access' => 'Invite-Only Indicator + Discord',
            'action_url' => null,
            'price' => '50.0',
            'purpose' => 'Levels',
            'layer' => 'Volatility & Structure Layer',
            'long_name' => 'Ticker-Tactix AAVWAP',
            'short_name' => 'T-T:AAVWAP',
            'trading_pace' => 'DAY TRADING',
            'key_output' => 'Anchored Value Reference',
            'short_description' => null,
            'long_description' => null,
            'core_features' => null,
            'customization_options' => null,
            'best_used_for' => null,
            'summary' => null,
            'icon' => 'avwap-doc',
            'is_active' => false,
        ],
        [
            'title' => 'Long WAP',
            'description' => 'Tracks longer-duration value positioning to help identify broader support, resistance, and higher-timeframe control.',
            'trader_types' => 'NYSE BASE; NYSE CORE; CRYPTO CORE',
            'market' => 'All',
            'version' => 'v1.0',
            'access' => 'Invite-Only Indicator + Discord',
            'action_url' => null,
            'price' => '30.0',
            'purpose' => 'Levels',
            'layer' => 'Volatility & Structure Layer',
            'long_name' => 'Ticker-Tactix Long WAP',
            'short_name' => 'T-T:LongWAP',
            'trading_pace' => 'SWING TRADING',
            'key_output' => 'Long-Term Value Position',
            'short_description' => null,
            'long_description' => null,
            'core_features' => null,
            'customization_options' => null,
            'best_used_for' => null,
            'summary' => null,
            'icon' => 'long-vwap-wave',
            'is_active' => false,
        ],
        [
            'title' => 'Candle Color',
            'description' => 'Simplifies candle-state interpretation by visually classifying bar behavior based on the module’s directional logic.',
            'trader_types' => 'NYSE PRO; CRYPTO PRO',
            'market' => 'All',
            'version' => 'v1.11',
            'access' => 'Invite-Only Indicator + Discord',
            'action_url' => null,
            'price' => '10.0',
            'purpose' => 'Breadth Cue',
            'layer' => 'Volatility & Structure Layer',
            'long_name' => 'Ticker-Tactix Candle Color',
            'short_name' => 'T-T:CC',
            'trading_pace' => 'DAY TRADING',
            'key_output' => 'Bar State/Directional Color',
            'short_description' => null,
            'long_description' => 'Ticker-Tactix Candle Color (T-T:CC) distills market breadth into a subtle yet powerful visual cue by conditioning candle wicks on NYSE Advance-Decline (ADD) extremes.

Rather than altering price structure or candle bodies, the indicator applies precise wick-only coloring to reflect underlying participation strength. This approach preserves raw price action while quietly revealing when broad market forces are decisively aligned or diverging from local price behavior.

By isolating high-conviction breadth regimes, T-T:CC provides immediate contextual awareness without clutter, making it ideal for traders who value clarity and restraint.',
            'core_features' => '• Breadth-Driven Wick Coloring – Candle wicks turn green when ADD exceeds bullish thresholds and red when ADD falls below bearish thresholds, signaling dominant market participation.
• Non-Intrusive Design – Wick-only visualization leaves candle bodies and borders untouched, preserving native price structure.
• Real-Time Breadth Sync – ADD data is dynamically aligned to the active chart timeframe for accurate intraday context.',
            'customization_options' => '• Adjustable bullish and bearish ADD thresholds.
• Compatible with all symbols and timeframes.
• Designed to layer seamlessly with price-based indicators and volume tools.',
            'best_used_for' => '• Identifying high-confidence directional regimes driven by market breadth.
• Detecting participation divergence during price extensions, consolidations, or false breakouts.
• Enhancing trade filtering and bias alignment for index, ETF, and options strategies.',
            'summary' => 'Ticker-Tactix Candle Color delivers breadth awareness with surgical precision — allowing traders to see market participation without distorting the price narrative.
',
            'icon' => 'candle-color',
            'is_active' => false,
        ],
    ],
    'playbooks' => [
        [
            'title' => 'NYSE Market Environment Daily Newsletter',
            'best_for' => 'Traders who want market context, sentiment, and volatility guidance before execution.',
            'trader_types' => 'NYSE BASE, NYSE CORE, NYSE PRO',
            'market' => 'NYSE',
            'access' => 'Daily Newsletter + Discord',
            'action_url' => null,
            'price' => '$70/mo',
            'trading_pace' => 'Swing Trading',
            'average_hold_time' => '~90 days',
            'icon' => 'market-data-bars',
            'is_active' => true,
        ],
        [
            'title' => 'Crypto Market Environment Daily Newsletter',
            'best_for' => 'Crypto traders who want sentiment and volatility context before taking positions.',
            'trader_types' => 'CRYPTO BASE, CRYPTO CORE, CRYPTO PRO',
            'market' => 'Crypto',
            'access' => 'Daily Newsletter + Discord',
            'action_url' => null,
            'price' => '$70/mo',
            'trading_pace' => 'Swing Trading',
            'average_hold_time' => '~60 days',
            'icon' => 'crypto-info-box',
            'is_active' => false,
        ],
        [
            'title' => 'Sigma Pro Engine (insert logo)',
            'best_for' => 'Crypto traders who want optimized trend-flip alerts through a partner community access model.',
            'trader_types' => 'CRYPTO BASE',
            'market' => 'Crypto',
            'access' => 'Partner Community Access',
            'action_url' => null,
            'price' => 'External / Token-Gated',
            'trading_pace' => 'System Alerts',
            'average_hold_time' => '—',
            'icon' => 'command-cube',
            'is_active' => true,
        ],
        [
            'title' => 'NYSE ETF Environment Daily Newsletter',
            'best_for' => 'Investors targeting multi-week sector rotation opportunities.',
            'trader_types' => 'NYSE CORE, NYSE PRO',
            'market' => 'NYSE',
            'access' => 'Daily Newsletter + Discord',
            'action_url' => null,
            'price' => '$125/mo',
            'trading_pace' => 'Swing Trading',
            'average_hold_time' => '~90 days',
            'icon' => 'sector-rotation',
            'is_active' => true,
        ],
        [
            'title' => 'XRP Turtle Playbook',
            'best_for' => 'Patient XRP traders looking for slower-developing momentum swings.',
            'trader_types' => 'CRYPTO CORE, CRYPTO PRO',
            'market' => 'Crypto',
            'access' => 'Alerts + Guided Discord',
            'action_url' => 'https://buy.stripe.com/9B6bJ1fGwfaO0Bs26Y28802',
            'price' => '$90/mo',
            'trading_pace' => 'Swing Trading',
            'average_hold_time' => '~16 days',
            'icon' => 'turtle',
            'is_active' => true,
        ],
        [
            'title' => 'SPY Scalp Playbook',
            'best_for' => 'Active traders focused on structured intraday momentum and higher-frequency execution.',
            'trader_types' => 'NYSE PRO',
            'market' => 'NYSE',
            'access' => 'Alerts + Guided Discord',
            'action_url' => null,
            'price' => '$180/mo',
            'trading_pace' => 'Day Trading',
            'average_hold_time' => '~4 minutes',
            'icon' => 'spy-playbook',
            'is_active' => false,
        ],
        [
            'title' => 'BTC Bunny Playbook',
            'best_for' => 'Short-term BTC traders seeking structured intraday momentum setups.',
            'trader_types' => 'CRYPTO PRO',
            'market' => 'Crypto',
            'access' => 'Alerts + Guided Discord',
            'action_url' => 'https://buy.stripe.com/bJe28rdyod2G5VMcLC28805',
            'price' => '$180/mo',
            'trading_pace' => 'Day Trading',
            'average_hold_time' => '~10 hours',
            'icon' => 'bunny',
            'is_active' => true,
        ],
        [
            'title' => 'SOL Bunny Playbook',
            'best_for' => 'Short-term SOL traders seeking structured intraday momentum setups.',
            'trader_types' => 'CRYPTO PRO',
            'market' => 'Crypto',
            'access' => 'Alerts + Guided Discord',
            'action_url' => null,
            'price' => 'Coming Soon',
            'trading_pace' => 'Day Trading',
            'average_hold_time' => '~9 hours',
            'icon' => 'bunny',
            'is_active' => false,
        ],
        [
            'title' => 'XRP Bunny Playbook',
            'best_for' => 'Short-term XRP traders seeking structured intraday momentum setups.',
            'trader_types' => 'CRYPTO PRO',
            'market' => 'Crypto',
            'access' => 'Alerts + Guided Discord',
            'action_url' => 'https://buy.stripe.com/4gMdR9cuk0fUbg626Y28800',
            'price' => '$180/mo',
            'trading_pace' => 'Day Trading',
            'average_hold_time' => '~16 hours',
            'icon' => 'bunny',
            'is_active' => true,
        ],
    ],
];
