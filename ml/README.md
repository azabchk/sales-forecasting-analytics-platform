# ML модуль (Developer A)

## Что делает
- Формирует признаки для ежедневного прогноза продаж по магазину.
- Обучает 2 модели (`Ridge`, `CatBoostRegressor`) на временном сплите.
- Сохраняет лучшую модель в `ml/artifacts/model.joblib` и метаданные в JSON.

## Установка и запуск (Ubuntu 24.04)
```bash
cd ml
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python train.py
python evaluate.py
```

## Результат
- `artifacts/model.joblib`
- `artifacts/model_metadata.json`
