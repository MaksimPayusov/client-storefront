'use client';

import React, { useEffect, useRef, useState } from 'react';
import { yandexDeliveryService } from '@/services/yandex-delivery.service';

declare global {
  interface Window {
    YaDelivery?: {
      createWidget: (config: any) => void;
    };
  }
}

export interface YandexDeliveryWidgetProps {
  city?: string;
  sourcePlatformStation?: string;
  weight?: number; // вес в граммах
  onSelectPoint?: (point: any) => void;
  className?: string;
}

export const YandexDeliveryWidget: React.FC<YandexDeliveryWidgetProps> = ({
  city = 'Москва',
  sourcePlatformStation,
  weight,
  onSelectPoint,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedPoint, setSelectedPoint] = useState<any>(null);
  const [config, setConfig] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const hasInitializedRef = useRef(false);

  useEffect(() => {
    // Загружаем конфигурацию из бэкенда
    const loadConfig = async () => {
      try {
        const backendConfig = await yandexDeliveryService.getConfig();
        setConfig(backendConfig);
      } catch (err) {
        console.error('Error loading Yandex Delivery config:', err);
        setError('Не удалось загрузить конфигурацию виджета');
      }
    };

    loadConfig();
  }, []);

  useEffect(() => {
    if (!config) return;

    const startWidget = () => {
      if (!window.YaDelivery || !containerRef.current) {
        return;
      }

      if (hasInitializedRef.current) {
        return;
      }
      hasInitializedRef.current = true;

      window.YaDelivery.createWidget({
        containerId: containerRef.current.id,
        params: {
          city: city,
          size: {
            height: '450px',
            width: '100%',
          },
          source_platform_station: sourcePlatformStation || config.sourcePlatformStation,
          physical_dims_weight_gross: weight || config.defaultWeight,
          delivery_price: (price: number) => price + ' руб',
          delivery_term: 3,
          show_select_button: true,
          filter: {
            type: [
              'pickup_point', // Пункт выдачи заказа
              'terminal', // Постамат
            ],
            is_yandex_branded: false,
            payment_methods: [
              'already_paid', // Доступен для доставки предоплаченных заказов
              'card_on_receipt', // Доступна оплата картой при получении
            ],
            payment_methods_filter: 'or',
          },
          // Коллбэк при выборе точки
          onSelectPoint: (point: any) => {
            console.log('Selected delivery point:', point);
            setSelectedPoint(point);
            if (onSelectPoint) {
              onSelectPoint(point);
            }
          },
        },
      });
    };

    // Загружаем скрипт виджета Яндекс.Доставки
    const loadScript = () => {
      if (document.getElementById('yandex-delivery-script')) {
        if (window.YaDelivery) {
          startWidget();
        } else {
          document.addEventListener('YaNddWidgetLoad', startWidget);
        }
        return;
      }

      const script = document.createElement('script');
      script.id = 'yandex-delivery-script';
      script.src = 'https://yastatic.net/s3/taxi-delivery-front/widget/v1.0.0/widget.js';
      script.async = true;
      script.onload = () => {
        startWidget();
      };
      script.onerror = () => {
        console.error('Не удалось загрузить скрипт Яндекс.Доставки');
        setError('Не удалось загрузить виджет Яндекс.Доставки');
      };
      document.body.appendChild(script);
    };

    loadScript();

    return () => {
      // Очистка при размонтировании
      document.removeEventListener('YaNddWidgetLoad', startWidget);
    };
  }, [city, sourcePlatformStation, weight, onSelectPoint, config]);

  if (error) {
    return (
      <div className={`${className} p-6 bg-red-50 border border-red-200 rounded-xl`}>
        <p className="text-red-900 font-semibold mb-2">Ошибка загрузки виджета</p>
        <p className="text-sm text-red-700">{error}</p>
      </div>
    );
  }

  if (!config) {
    return (
      <div className={`${className} p-6 bg-gray-100 border border-gray-200 rounded-xl`}>
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3" />
          <span className="text-gray-600">Загрузка виджета...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div
        id="delivery-widget"
        ref={containerRef}
        className="rounded-xl overflow-hidden border border-gray-200"
      />
      {selectedPoint && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
          <h3 className="font-semibold text-green-900 mb-2">Выбранный пункт выдачи:</h3>
          <p className="text-sm text-green-800">
            <strong>Адрес:</strong> {selectedPoint.address || 'Не указан'}
          </p>
          {selectedPoint.schedule && (
            <p className="text-sm text-green-800">
              <strong>Режим работы:</strong> {selectedPoint.schedule}
            </p>
          )}
          {selectedPoint.price && (
            <p className="text-sm text-green-800">
              <strong>Стоимость доставки:</strong> {selectedPoint.price} руб
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default YandexDeliveryWidget;
