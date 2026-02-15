import pandas as pd


def add_calendar_features(df: pd.DataFrame) -> pd.DataFrame:
    out = df.copy()
    out["date"] = pd.to_datetime(out["full_date"])
    out["day"] = out["date"].dt.day
    out["month"] = out["date"].dt.month
    out["year"] = out["date"].dt.year
    out["week_of_year"] = out["date"].dt.isocalendar().week.astype(int)
    out["day_of_week"] = out["date"].dt.dayofweek + 1
    out["is_weekend"] = out["day_of_week"].isin([6, 7]).astype(int)
    return out


def add_lag_rolling_features(df: pd.DataFrame) -> pd.DataFrame:
    out = df.sort_values(["store_id", "full_date"]).copy()
    group = out.groupby("store_id")["sales"]

    for lag in [1, 7, 14, 28]:
        out[f"lag_{lag}"] = group.shift(lag)

    for win in [7, 14, 28]:
        out[f"roll_mean_{win}"] = group.shift(1).rolling(window=win).mean()

    return out


def build_feature_matrix(df: pd.DataFrame):
    df = add_calendar_features(df)
    df = add_lag_rolling_features(df)
    df = df.dropna().reset_index(drop=True)

    feature_cols = [
        "store_id", "customers", "promo", "school_holiday", "open",
        "day", "month", "year", "week_of_year", "day_of_week", "is_weekend",
        "competition_distance", "promo2",
        "lag_1", "lag_7", "lag_14", "lag_28",
        "roll_mean_7", "roll_mean_14", "roll_mean_28",
    ]
    x = df[feature_cols]
    y = df["sales"]
    return x, y, feature_cols, df
