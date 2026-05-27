import { AvwapDoc } from './avwap-doc';
import { BacktestValidator } from './backtest-validator';
import { BacktestedBrainCircuit } from './backtested-brain-circuit';
import { BreadthCue } from './breadth-cue';
import { CandleColor } from './candle-color';
import { Chat } from './chat';
import { ChevronLeft } from './chevron-left';
import { ChevronRight } from './chevron-right';
import { CommandCube } from './command-cube';
import { CompositeEngine } from './composite-engine';
import { CryptoInfoBox } from './crypto-info-box';
import { DataPipeline } from './data-pipeline';
import { DirectionTarget } from './direction-target';
import { DragHandle } from './drag-handle';
import { ExecutionOptimizer } from './execution-optimizer';
import { GoalPosts } from './goal-posts';
import { InfoBox } from './info-box';
import { LiquidityScanner } from './liquidity-scanner';
import { Lock } from './lock';
import { LongVwapWave } from './long-vwap-wave';
import { MarketDataBars } from './market-data-bars';
import { MomentumCycles } from './momentum-cycles';
import { ParticipationNetwork } from './participation-network';
import { PlaybooksBookOpen } from './playbooks-book-open';
import { Pulse } from './pulse';
import { Rabbit } from './rabbit';
import { RangeRails } from './range-rails';
import { SectorRotation } from './sector-rotation';
import { SentimentTracker } from './sentiment-tracker';
import { SequencePressure } from './sequence-pressure';
import { SpyPlaybook } from './spy-playbook';
import { TrendTracer } from './trend-tracer';
import { Turtle } from './turtle';
import { User } from './user';
import { VersionedLayers } from './versioned-layers';
import { VolatilityPulse } from './volatility-pulse';

export const tickerTactixIcons = {
    'backtested-brain-circuit': BacktestedBrainCircuit,
    'command-cube': CommandCube,
    'versioned-layers': VersionedLayers,
    'market-data-bars': MarketDataBars,
    'direction-target': DirectionTarget,
    'participation-network': ParticipationNetwork,
    'volatility-pulse': VolatilityPulse,
    'playbooks-book-open': PlaybooksBookOpen,
    'momentum-cycles': MomentumCycles,
    'sequence-pressure': SequencePressure,
    'trend-tracer': TrendTracer,
    pulse: Pulse,
    'breadth-cue': BreadthCue,
    'info-box': InfoBox,
    'goal-posts': GoalPosts,
    'avwap-doc': AvwapDoc,
    'long-vwap-wave': LongVwapWave,
    'candle-color': CandleColor,
    'sector-rotation': SectorRotation,
    'spy-playbook': SpyPlaybook,
    turtle: Turtle,
    rabbit: Rabbit,
    'crypto-info-box': CryptoInfoBox,
    'range-rails': RangeRails,
    lock: Lock,
    user: User,
    chat: Chat,
    'chevron-left': ChevronLeft,
    'chevron-right': ChevronRight,
    'data-pipeline': DataPipeline,
    'sentiment-tracker': SentimentTracker,
    'liquidity-scanner': LiquidityScanner,
    'drag-handle': DragHandle,
    'execution-optimizer': ExecutionOptimizer,
    'backtest-validator': BacktestValidator,
    'composite-engine': CompositeEngine,
} as const;

export type TickerTactixIconName = keyof typeof tickerTactixIcons;
