const fontFamily =
  "'Outfit',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,'Noto Sans',sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol','Noto Color Emoji'"

export const lightThemeConfig = {
  borderRadius: 9,
  borderRadiusSM: 6,
  borderRadiusXS: 3,
  boxShadow:
    ' 0 0 0 1px rgba(0,0,0,0.05) ,     0 6px 16px 0 rgba(0, 0, 0, 0.08),      0 3px 6px -4px rgba(0, 0, 0, 0.12),      0 9px 28px 8px rgba(0, 0, 0, 0.05)    ',
  boxShadowSecondary:
    '0 0 0 1px rgba(0,0,0,0.05) ,     0 6px 16px 0 rgba(0, 0, 0, 0.08),      0 3px 6px -4px rgba(0, 0, 0, 0.12),      0 9px 28px 8px rgba(0, 0, 0, 0.05)    ',
  colorPrimary: '#6817ff',
  colorWarning: '#ffc041',
  fontFamily,
  zIndexPopupBase: 100_000
}

export const darkThemeConfig = {
  borderRadius: 9,
  borderRadiusSM: 6,
  borderRadiusXS: 3,
  boxShadow:
    '0 0 0 1px rgb(42, 39, 51), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05);',
  boxShadowSecondary:
    '  0 0 0 1px rgb(42, 39, 51),    0 6px 16px 0 rgba(0, 0, 0, 0.08),      0 3px 6px -4px rgba(0, 0, 0, 0.12),      0 9px 28px 8px rgba(0, 0, 0, 0.05)    ',
  colorBgBase: '#060508',
  colorPrimary: '#6817ff',
  colorWarning: '#ffc041',
  fontFamily,
  zIndexPopupBase: 100_000
}
