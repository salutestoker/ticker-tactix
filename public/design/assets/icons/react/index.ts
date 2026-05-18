import { BacktestedBrainCircuit } from "./backtested-brain-circuit";
import { CommandCube } from "./command-cube";
import { VersionedLayers } from "./versioned-layers";
import { MarketDataBars } from "./market-data-bars";
import { DirectionTarget } from "./direction-target";
import { ParticipationNetwork } from "./participation-network";
import { VolatilityPulse } from "./volatility-pulse";
import { PlaybooksBookOpen } from "./playbooks-book-open";
import { MomentumCycles } from "./momentum-cycles";
import { SequencePressure } from "./sequence-pressure";
import { TrendTracer } from "./trend-tracer";
import { Pulse } from "./pulse";
import { BreadthCue } from "./breadth-cue";
import { InfoBox } from "./info-box";
import { GoalPosts } from "./goal-posts";
import { AvwapDoc } from "./avwap-doc";
import { LongVwapWave } from "./long-vwap-wave";
import { CandleColor } from "./candle-color";
import { SectorRotation } from "./sector-rotation";
import { SpyPlaybook } from "./spy-playbook";
import { Turtle } from "./turtle";
import { Rabbit } from "./rabbit";
import { CryptoInfoBox } from "./crypto-info-box";
import { RangeRails } from "./range-rails";
import { Lock } from "./lock";
import { User } from "./user";
import { Chat } from "./chat";
import { ChevronLeft } from "./chevron-left";
import { ChevronRight } from "./chevron-right";
import { DataPipeline } from "./data-pipeline";
import { SentimentTracker } from "./sentiment-tracker";
import { LiquidityScanner } from "./liquidity-scanner";
import { ExecutionOptimizer } from "./execution-optimizer";
import { BacktestValidator } from "./backtest-validator";
import { CompositeEngine } from "./composite-engine";

export const tickerTactixIcons = {
  "backtested-brain-circuit": BacktestedBrainCircuit,
  "command-cube": CommandCube,
  "versioned-layers": VersionedLayers,
  "market-data-bars": MarketDataBars,
  "direction-target": DirectionTarget,
  "participation-network": ParticipationNetwork,
  "volatility-pulse": VolatilityPulse,
  "playbooks-book-open": PlaybooksBookOpen,
  "momentum-cycles": MomentumCycles,
  "sequence-pressure": SequencePressure,
  "trend-tracer": TrendTracer,
  "pulse": Pulse,
  "breadth-cue": BreadthCue,
  "info-box": InfoBox,
  "goal-posts": GoalPosts,
  "avwap-doc": AvwapDoc,
  "long-vwap-wave": LongVwapWave,
  "candle-color": CandleColor,
  "sector-rotation": SectorRotation,
  "spy-playbook": SpyPlaybook,
  "turtle": Turtle,
  "rabbit": Rabbit,
  "crypto-info-box": CryptoInfoBox,
  "range-rails": RangeRails,
  "lock": Lock,
  "user": User,
  "chat": Chat,
  "chevron-left": ChevronLeft,
  "chevron-right": ChevronRight,
  "data-pipeline": DataPipeline,
  "sentiment-tracker": SentimentTracker,
  "liquidity-scanner": LiquidityScanner,
  "execution-optimizer": ExecutionOptimizer,
  "backtest-validator": BacktestValidator,
  "composite-engine": CompositeEngine,
} as const;

export type TickerTactixIconName = keyof typeof tickerTactixIcons;
