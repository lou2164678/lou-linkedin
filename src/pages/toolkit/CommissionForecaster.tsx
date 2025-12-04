import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowLeft, FaPlus, FaTrash, FaChartLine, FaCalculator } from "react-icons/fa";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
    ReferenceDot,
} from "recharts";

interface AcceleratorTier {
    threshold: number; // % of quota (e.g., 100, 120, 150)
    multiplier: number; // e.g., 1.0, 1.5, 2.0
}

interface Deal {
    id: string;
    name: string;
    value: number;
    probability: number; // 0-100%
}

interface CompPlan {
    baseSalary: number;
    ote: number;
    quota: number;
    accelerators: AcceleratorTier[];
}

const DEFAULT_ACCELERATORS: AcceleratorTier[] = [
    { threshold: 0, multiplier: 0.5 },
    { threshold: 50, multiplier: 0.75 },
    { threshold: 100, multiplier: 1.0 },
    { threshold: 120, multiplier: 1.5 },
    { threshold: 150, multiplier: 2.0 },
];

const DEFAULT_COMP_PLAN: CompPlan = {
    baseSalary: 60000,
    ote: 120000,
    quota: 500000,
    accelerators: DEFAULT_ACCELERATORS,
};

const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
};

const formatPercent = (value: number): string => {
    return `${value.toFixed(0)}%`;
};

const generateId = (): string => Math.random().toString(36).substring(2, 9);

const CommissionForecaster = () => {
    const [compPlan, setCompPlan] = useState<CompPlan>(DEFAULT_COMP_PLAN);
    const [deals, setDeals] = useState<Deal[]>([
        { id: generateId(), name: "Acme Corp", value: 75000, probability: 80 },
        { id: generateId(), name: "TechStart Inc", value: 50000, probability: 60 },
        { id: generateId(), name: "Global Ltd", value: 120000, probability: 40 },
    ]);
    const [scenarioAdjustment, setScenarioAdjustment] = useState(0); // -50 to +50%

    const variableComp = compPlan.ote - compPlan.baseSalary;
    const commissionRate = variableComp / compPlan.quota;

    // Calculate weighted pipeline value
    const weightedPipeline = useMemo(() => {
        return deals.reduce((sum, deal) => sum + deal.value * (deal.probability / 100), 0);
    }, [deals]);

    // Apply scenario adjustment
    const projectedBookings = weightedPipeline * (1 + scenarioAdjustment / 100);
    const quotaAttainment = (projectedBookings / compPlan.quota) * 100;

    // Calculate commission based on accelerators
    const calculateCommission = (attainment: number): number => {
        const sortedTiers = [...compPlan.accelerators].sort((a, b) => b.threshold - a.threshold);
        let commission = 0;
        let remainingAttainment = attainment;

        for (let i = 0; i < sortedTiers.length; i++) {
            const tier = sortedTiers[i];
            const nextThreshold = i < sortedTiers.length - 1 ? sortedTiers[i + 1].threshold : 0;

            if (remainingAttainment > tier.threshold) {
                const attainmentInTier = Math.min(remainingAttainment, tier.threshold + 100) - tier.threshold;
                const bookingsInTier = (attainmentInTier / 100) * compPlan.quota;
                commission += bookingsInTier * commissionRate * tier.multiplier;
                remainingAttainment = tier.threshold;
            }
        }

        return commission;
    };

    const projectedCommission = calculateCommission(quotaAttainment);
    const totalEarnings = compPlan.baseSalary + projectedCommission;

    // Generate chart data
    const chartData = useMemo(() => {
        const points = [];
        for (let attainment = 0; attainment <= 200; attainment += 5) {
            const commission = calculateCommission(attainment);
            points.push({
                attainment,
                commission,
                totalEarnings: compPlan.baseSalary + commission,
            });
        }
        return points;
    }, [compPlan, commissionRate]);

    // Find next accelerator tier
    const nextTier = compPlan.accelerators
        .filter((t) => t.threshold > quotaAttainment)
        .sort((a, b) => a.threshold - b.threshold)[0];

    const dealsToNextTier = nextTier
        ? Math.ceil(((nextTier.threshold - quotaAttainment) / 100) * compPlan.quota / 25000)
        : 0;

    const handleAddDeal = () => {
        setDeals([
            ...deals,
            { id: generateId(), name: "New Deal", value: 25000, probability: 50 },
        ]);
    };

    const handleRemoveDeal = (id: string) => {
        setDeals(deals.filter((d) => d.id !== id));
    };

    const handleUpdateDeal = (id: string, field: keyof Deal, value: string | number) => {
        setDeals(
            deals.map((d) =>
                d.id === id ? { ...d, [field]: field === "name" ? value : Number(value) } : d
            )
        );
    };

    const handleUpdateCompPlan = (field: keyof CompPlan, value: number) => {
        setCompPlan({ ...compPlan, [field]: value });
    };

    return (
        <div className="min-h-screen py-20">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="mb-8">
                    <Link
                        to="/projects"
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        <FaArrowLeft className="mr-2" />
                        Back to Projects
                    </Link>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
                            Commission Forecaster & Scenario Planner
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 text-lg">
                            Model your earnings with "what-if" scenarios. Enter your comp plan, add your pipeline deals, and visualize your path to quota.
                        </p>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white shadow-lg">
                            <div className="text-sm opacity-80 mb-1">Quota Attainment</div>
                            <div className="text-2xl font-bold">{formatPercent(quotaAttainment)}</div>
                        </div>
                        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white shadow-lg">
                            <div className="text-sm opacity-80 mb-1">Projected Commission</div>
                            <div className="text-2xl font-bold">{formatCurrency(projectedCommission)}</div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 text-white shadow-lg">
                            <div className="text-sm opacity-80 mb-1">Total Earnings</div>
                            <div className="text-2xl font-bold">{formatCurrency(totalEarnings)}</div>
                        </div>
                        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-4 text-white shadow-lg">
                            <div className="text-sm opacity-80 mb-1">
                                {nextTier ? `To ${formatPercent(nextTier.threshold)} (${nextTier.multiplier}x)` : "At Max Tier"}
                            </div>
                            <div className="text-2xl font-bold">
                                {nextTier ? `~${dealsToNextTier} deals` : "🎉"}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Comp Plan Inputs */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                                <FaCalculator className="mr-2 text-blue-600" />
                                Comp Plan
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Base Salary
                                    </label>
                                    <input
                                        type="number"
                                        value={compPlan.baseSalary}
                                        onChange={(e) => handleUpdateCompPlan("baseSalary", Number(e.target.value))}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        OTE (On-Target Earnings)
                                    </label>
                                    <input
                                        type="number"
                                        value={compPlan.ote}
                                        onChange={(e) => handleUpdateCompPlan("ote", Number(e.target.value))}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Annual Quota
                                    </label>
                                    <input
                                        type="number"
                                        value={compPlan.quota}
                                        onChange={(e) => handleUpdateCompPlan("quota", Number(e.target.value))}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        Variable Comp: <span className="font-semibold">{formatCurrency(variableComp)}</span>
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        Base Rate: <span className="font-semibold">{(commissionRate * 100).toFixed(1)}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Scenario Slider */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                                <FaChartLine className="mr-2 text-green-600" />
                                Scenario Planning
                            </h2>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        "What if I close {scenarioAdjustment >= 0 ? "+" : ""}{scenarioAdjustment}% more?"
                                    </label>
                                    <input
                                        type="range"
                                        min="-50"
                                        max="100"
                                        value={scenarioAdjustment}
                                        onChange={(e) => setScenarioAdjustment(Number(e.target.value))}
                                        className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        <span>-50%</span>
                                        <span>0%</span>
                                        <span>+50%</span>
                                        <span>+100%</span>
                                    </div>
                                </div>

                                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                        Weighted Pipeline: <span className="font-semibold">{formatCurrency(weightedPipeline)}</span>
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                        Projected Bookings: <span className="font-semibold">{formatCurrency(projectedBookings)}</span>
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        vs OTE: <span className={`font-semibold ${totalEarnings >= compPlan.ote ? 'text-green-600' : 'text-orange-600'}`}>
                                            {totalEarnings >= compPlan.ote ? '+' : ''}{formatCurrency(totalEarnings - compPlan.ote)}
                                        </span>
                                    </div>
                                </div>

                                {/* Accelerator Tiers Display */}
                                <div>
                                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Accelerator Tiers
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {compPlan.accelerators.map((tier, idx) => (
                                            <div
                                                key={idx}
                                                className={`text-xs px-2 py-1 rounded ${quotaAttainment >= tier.threshold
                                                        ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                                                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                                                    }`}
                                            >
                                                {tier.threshold}%: {tier.multiplier}x
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Chart */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700 mb-8">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                            Earnings Curve
                        </h2>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis
                                        dataKey="attainment"
                                        tickFormatter={(v) => `${v}%`}
                                        stroke="#9ca3af"
                                        fontSize={12}
                                    />
                                    <YAxis
                                        tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                                        stroke="#9ca3af"
                                        fontSize={12}
                                    />
                                    <Tooltip
                                        formatter={(value: number) => [formatCurrency(value), "Total Earnings"]}
                                        labelFormatter={(label) => `Quota: ${label}%`}
                                        contentStyle={{
                                            backgroundColor: "#1f2937",
                                            border: "none",
                                            borderRadius: "8px",
                                            color: "#fff",
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="totalEarnings"
                                        stroke="#3b82f6"
                                        fillOpacity={1}
                                        fill="url(#colorEarnings)"
                                    />
                                    {/* OTE Reference Line */}
                                    <ReferenceLine
                                        y={compPlan.ote}
                                        stroke="#22c55e"
                                        strokeDasharray="5 5"
                                        label={{ value: "OTE", fill: "#22c55e", fontSize: 12 }}
                                    />
                                    {/* Current Position */}
                                    <ReferenceDot
                                        x={Math.min(quotaAttainment, 200)}
                                        y={totalEarnings}
                                        r={8}
                                        fill="#f97316"
                                        stroke="#fff"
                                        strokeWidth={2}
                                    />
                                    {/* Accelerator tier lines */}
                                    {compPlan.accelerators.map((tier, idx) => (
                                        <ReferenceLine
                                            key={idx}
                                            x={tier.threshold}
                                            stroke="#9ca3af"
                                            strokeDasharray="2 2"
                                            opacity={0.5}
                                        />
                                    ))}
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex items-center justify-center gap-6 mt-4 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                                <span className="text-gray-600 dark:text-gray-400">Your Position</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-0.5 bg-green-500"></div>
                                <span className="text-gray-600 dark:text-gray-400">OTE</span>
                            </div>
                        </div>
                    </div>

                    {/* Pipeline Deals */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                                Pipeline Deals
                            </h2>
                            <button
                                onClick={handleAddDeal}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                            >
                                <FaPlus className="mr-2" />
                                Add Deal
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200 dark:border-gray-700">
                                        <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            Deal Name
                                        </th>
                                        <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            Value
                                        </th>
                                        <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            Probability
                                        </th>
                                        <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            Weighted
                                        </th>
                                        <th className="py-3 px-2"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {deals.map((deal) => (
                                        <tr key={deal.id} className="border-b border-gray-100 dark:border-gray-700/50">
                                            <td className="py-3 px-2">
                                                <input
                                                    type="text"
                                                    value={deal.name}
                                                    onChange={(e) => handleUpdateDeal(deal.id, "name", e.target.value)}
                                                    className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                />
                                            </td>
                                            <td className="py-3 px-2">
                                                <input
                                                    type="number"
                                                    value={deal.value}
                                                    onChange={(e) => handleUpdateDeal(deal.id, "value", e.target.value)}
                                                    className="w-24 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                />
                                            </td>
                                            <td className="py-3 px-2">
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="range"
                                                        min="0"
                                                        max="100"
                                                        value={deal.probability}
                                                        onChange={(e) => handleUpdateDeal(deal.id, "probability", e.target.value)}
                                                        className="w-20 accent-blue-600"
                                                    />
                                                    <span className="text-sm text-gray-600 dark:text-gray-400 w-10">
                                                        {deal.probability}%
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-2 text-sm text-gray-700 dark:text-gray-300">
                                                {formatCurrency(deal.value * (deal.probability / 100))}
                                            </td>
                                            <td className="py-3 px-2">
                                                <button
                                                    onClick={() => handleRemoveDeal(deal.id)}
                                                    className="text-red-500 hover:text-red-700 transition-colors p-1"
                                                >
                                                    <FaTrash size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="border-t-2 border-gray-300 dark:border-gray-600">
                                        <td className="py-3 px-2 font-semibold text-gray-800 dark:text-white">
                                            Total Pipeline
                                        </td>
                                        <td className="py-3 px-2 font-semibold text-gray-800 dark:text-white">
                                            {formatCurrency(deals.reduce((sum, d) => sum + d.value, 0))}
                                        </td>
                                        <td className="py-3 px-2"></td>
                                        <td className="py-3 px-2 font-semibold text-green-600 dark:text-green-400">
                                            {formatCurrency(weightedPipeline)}
                                        </td>
                                        <td></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default CommissionForecaster;
