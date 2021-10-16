import './style.css'

export function Filters(props) {
    const weekday = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
    return (
        <div className={`container-filters ${!props.filterOpen ? 'hidden' : ''}`}>

            <div className="filters">
                <span className="filters-title">Dia da Semana</span>
                <div className="weekdays-list">
                    {weekday.map(function (dia) {
                        return (
                            <div
                                className={`container-chip ${(props.filterWeekdays).includes(dia) ? 'chip-on' : ''}`}
                                key={dia}
                                name={dia}
                                onClick={props.handleSelectWeekday}
                            >
                                {dia}
                                <span>+</span>
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className="filters categories">
                <span className="filters-title">Categoria</span>
                <div className="categories-list">
                    {props.categories.map(function (category) {
                        return (
                            <div
                                className={`container-chip ${(props.filterCategory).includes(category) ? 'chip-on' : ''}`}
                                key={category}
                                name={category}
                                onClick={props.handleSelectCategory}
                            >
                                {category}
                                <span>+</span>
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className="filters ">
                <span className="filters-title values">Valor</span>

                <div className="filters-values">
                    <div>
                        <label htmlFor="min-value">Min</label>
                        <input
                            id="min-value"
                            name='minValue'
                            value={props.filters.minValue}
                            onChange={props.handleFilters}
                            type="number"
                        />
                    </div>
                    <div>
                        <label htmlFor="max-value">Max</label>
                        <input
                            id="max-value"
                            name="maxValue"
                            value={props.filters.maxValue}
                            onChange={props.handleFilters}
                            type="number"
                        />
                    </div>
                </div>
            </div>

            <div className="filters-buttons">
                <button
                    className="btn-clear-filters"
                    onClick={props.handleClearFilters}>
                    Limpar Filtros
                </button>
                <button
                    className="btn-apply-filters"
                    onClick={props.applyFilter}>
                    Aplicar Filtros
                </button>
            </div>
        </div>
    )
}