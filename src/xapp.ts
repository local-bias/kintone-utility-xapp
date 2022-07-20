import { Record as KintoneRecord } from '@kintone/rest-api-client/lib/client/types';
import { Cybozu } from './cybozu';

declare const cybozu: Cybozu;

/**
 * kintone javascript APIから実行環境を取得し、モバイル端末である場合はTrueを返却します
 *
 * 引数としてイベントタイプを設定することで、より安全なチェックを行います
 *
 * 判定の以下の優先順にしたがって実行されます
 *
 * 1. イベントタイプに指定がある場合はタイプ名から判定
 * 2. グローバル変数が存在する場合はそれに従う
 * 3. kintone javascript APIから、アプリIDを取得して判定
 *
 * @param eventType イベントタイプ
 * @returns 実行環境がモバイル端末である場合はtrue
 */
export const isMobile = (eventType?: string): boolean => {
  if (eventType) {
    return eventType.includes('mobile.');
  }
  return cybozu?.data?.IS_MOBILE_DEVICE ?? !kintone.app.getId();
};

/** モバイル対応 ```kintone.app()``` */
export const getApp = (eventType?: string): typeof kintone.mobile.app | typeof kintone.app =>
  isMobile(eventType) ? kintone.mobile.app : kintone.app;

/** モバイル対応 ```kintone.app.getId()``` */
export const getAppId = (): number | null => getApp().getId();

/** モバイル対応 ```kintone.app.record.getId()``` */
export const getRecordId = (): number | null => getApp().record.getId();

/** モバイル対応 ```kintone.app.record.getSpaceElement()``` */
export const getSpaceElement = (spaceId: string): HTMLElement | null =>
  getApp().record.getSpaceElement(spaceId);

/** モバイル対応 ```kintone.app.getQuery()``` */
export const getQuery = (): string | null => getApp().getQuery();

/** モバイル対応 ```kintone.app.getQueryCondition()``` */
export const getQueryCondition = (): string | null => getApp().getQueryCondition();

/** モバイル対応 ```kintone.app.record.get()``` */
export const getCurrentRecord = <T = KintoneRecord>(): { record: T } => getApp().record.get();

/** モバイル対応 ```kintone.app.record.set()``` */
export const setCurrentRecord = (record: { record: any }): void => getApp().record.set(record);

/** モバイル対応 ```kintone.app.record.setFieldShown()``` */
export const setFieldShown = <T = Record<string, unknown>>(code: keyof T, visible: boolean): void =>
  getApp().record.setFieldShown(String(code), visible);

/** 一覧に応じて、ツールバー部分を優先してヘッダー要素を返します */
export const getHeaderSpace = (eventType: string): HTMLElement | null => {
  if (isMobile(eventType)) {
    kintone.mobile.app.getHeaderSpaceElement();
  } else if (!~eventType.indexOf('index')) {
    return kintone.app.record.getHeaderMenuSpaceElement();
  }
  return kintone.app.getHeaderMenuSpaceElement();
};

/**
 * 指定したフィールドコードに対応するDOM要素を返却します
 *
 * ### 動作する画面
 * - レコード詳細画面
 * - レコード印刷画面
 *
 * @param fieldCode フィールドコード
 * @returns DOM要素
 */
export const getFieldElement = (fieldCode: string) => {
  return getApp().record.getFieldElement(fieldCode);
};

/**
 * 指定したフィールドコードに対応する各レコードのDOM要素を返却します
 *
 * ### 動作する画面
 * - レコード一覧画面
 *
 * @param fieldCode
 * @returns
 */
export const getFieldElements = (fieldCode: string) => {
  return getApp().getFieldElements(fieldCode);
};
