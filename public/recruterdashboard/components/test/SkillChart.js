function SkillChart({ skills }) {
    const canvasRef = React.useRef(null);
    const chartRef = React.useRef(null);

    React.useEffect(() => {
        if (!canvasRef.current || !skills || skills.length === 0) return;

        const ctx = canvasRef.current.getContext('2d');
        if (chartRef.current) {
            chartRef.current.destroy();
        }

        const labels = skills.map(s => s.name);
        const data = skills.map(s => s.score);

        chartRef.current = new window.ChartJS(ctx, {
            type: 'radar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Skill Proficiency (0-10)',
                    data: data,
                    fill: true,
                    backgroundColor: 'rgba(79, 70, 229, 0.2)',
                    borderColor: 'rgb(79, 70, 229)',
                    pointBackgroundColor: 'rgb(79, 70, 229)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgb(79, 70, 229)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: { color: 'rgba(0,0,0,0.1)' },
                        grid: { color: 'rgba(0,0,0,0.1)' },
                        pointLabels: { font: { size: 12 } },
                        suggestedMin: 0,
                        suggestedMax: 10
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });

        return () => {
            if (chartRef.current) chartRef.current.destroy();
        };
    }, [skills]);

    return (
        <div className="h-[300px] w-full flex items-center justify-center">
            <canvas ref={canvasRef}></canvas>
        </div>
    );
}