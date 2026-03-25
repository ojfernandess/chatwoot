# frozen_string_literal: true

# Agents Labs: replaces default Chatwoot /brand-assets/* logos with public/agentslabslogo.png
# on existing databases (new installs also pick this up via config/installation_config.yml).
# To use different assets, set logos in Super Admin → Settings → App Config or remove this initializer.
Rails.application.config.after_initialize do
  unless defined?(InstallationConfig) && ActiveRecord::Base.connection.data_source_exists?('installation_configs')
    next
  end

  target_logo = '/agentslabslogo.png'
  %w[LOGO LOGO_DARK LOGO_THUMBNAIL].each do |config_name|
    record = InstallationConfig.find_by(name: config_name)
    next if record.blank?

    current = record.value.to_s
    next if current == target_logo
    next unless current.match?(%r{/brand-assets/logo})

    record.update!(value: target_logo)
  end
rescue StandardError => e
  Rails.logger.warn("[agentslabs_branding] #{e.class}: #{e.message}")
end
